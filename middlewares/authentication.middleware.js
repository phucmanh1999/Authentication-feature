const jwt = require('jsonwebtoken');

const domainBlock = ['/sign-up', '/sign-in'];

const decodeToken = (req, res, next) => {
  try {
    if (domainBlock.includes(req.originalUrl)) {
      return next();
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      algorithms: ['HS256'],
    });
    req.user = decoded;
  } catch (err) {
    return next();
  }
  return next();
};

const verifyToken = (req, res, next) => {
  try {
    if (domainBlock.includes(req.originalUrl)) {
      return next();
    }
    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];
    if (token) {
      jwt.verify(
        token,
        process.env.SECRET_KEY,
        { algorithms: ['HS256'] },
        (error) => {
          if (error) {
            res.sendStatus(403);
          } else {
            return next();
          }
        }
      );
    } else {
      res.sendStatus(403);
    }
  } catch (error) {
    res.sendStatus(403);
  }
};

module.exports = {
  decodeToken,
  verifyToken,
};
