function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function passwordIsValid(password) {
  if (password.length < 8 || password.length > 20) return false;
  return true;
}

const validator = (req, res, next) => {
  try {
    if (!emailIsValid(req.body.email)) {
      res.status(400).json({ msg: 'Email is not valid' });
      return;
    }

    if (!passwordIsValid(req.body.password)) {
      res.status(400).json({ msg: 'Password must be between 8-20 characters' });
      return;
    }
  } catch (error) {
    res.status(500).json(error);
  }

  return next();
};

module.exports = {
  validator,
};
