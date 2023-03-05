const express = require('express');
const router = express.Router();
const UserService = require('../services/user.service');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { validator } = require('../middlewares/validations.middleware');

router.get('/', (req, res) => {
  UserService.getAll().then((data) => {
    res.json(data);
  });
});

router.post('/sign-up', validator, (req, res) => {
  try {
    const user = {
      email: req.body.email,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      password: bcrypt.hashSync(req.body.password, 10),
    };

    UserService.findByEmail(user.email).then(([data]) => {
      if (data) {
        res.status(400).json({ msg: 'Email existed' });
      } else {
        UserService.createUser(user)
          .then(async ([data]) => {
            const userId = data;
            const [newUser] = await UserService.findById(userId);
            const returnUser = {
              id: newUser.id,
              firstName: newUser.first_name,
              lastName: newUser.last_name,
              email: newUser.email,
              displayName: newUser.first_name + newUser.last_name,
            };
            res.status(201).json(returnUser);
          })
          .catch(() => {
            res
              .status(500)
              .json({ msg: 'Cannot create account, please check again' });
          });
      }
    });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.post('/sign-in', validator, (req, res) => {
  UserService.findByEmail(req.body.email)
    .then(async ([userEntity]) => {
      if (userEntity) {
        if (await UserService.isValidPassword(userEntity, req.body.password)) {
          const data = await generateToken(userEntity, res);
          res.status(200).json(data);
        } else res.status(400).json({ msg: 'Password is incorrect' });
      } else {
        res.status(400).json({ msg: 'Email is incorrect' });
      }
    })
    .catch((err) => {
      res.status(500).json(err);
    });
});

generateToken = async (userEntity, res) => {
  const user = {
    firstName: userEntity.first_name,
    lastName: userEntity.last_name,
    email: userEntity.email,
    displayName: userEntity.first_name + userEntity.last_name,
  };

  const payload = {
    id: userEntity.id,
    ...user,
  };
  const accessToken = 'Bearer ' + jwt.sign(payload, process.env.SECRET_KEY);
  const refreshToken =
    'Bearer ' + jwt.sign(payload, process.env.SECRET_KEY_REFRESH_TOKEN);
  const accessTokenExpiresIn = new Date(Date.now() + 60 * 60);
  const refreshTokenExpiresIn = new Date(Date.now() + 60 * 60 * 24 * 30);
  await UserService.saveRefreshToken(
    userEntity.id,
    refreshToken,
    refreshTokenExpiresIn
  );
  res.cookie('token', accessToken, {
    expires: accessTokenExpiresIn,
    httpOnly: true,
  });
  res.cookie('refreshToken', accessToken, {
    expires: refreshTokenExpiresIn,
    httpOnly: true,
  });

  return {
    user: user,
    token: accessToken,
    refreshToken,
  };
};

router.post('/sign-out', (req, res) => {
  UserService.signOut(req.user.id)
    .then(() => {
      res.status(200).send();
    })
    .catch(() => {
      res.status(500).send();
    });
});

router.post('/refresh-token', (req, res) => {
  try {
    const { refreshToken } = req.body;
    jwt.verify(
      refreshToken,
      process.env.SECRET_KEY_REFRESH_TOKEN,
      { algorithms: ['HS256'] },
      (error) => {
        if (error) {
          res.sendStatus(403);
        } else {
          UserService.findByEmail(req.user.email)
            .then(async ([userEntity]) => {
              const { token, refreshToken } = await generateToken(
                userEntity,
                res
              );
              res.status(200).json({ token, refreshToken });
            })
            .catch((err) => {
              res.status(500).json(err);
            });
        }
      }
    );
  } catch (error) {
    res.sendStatus(403);
  }
});

module.exports = router;
