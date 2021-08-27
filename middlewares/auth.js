const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'secret-key' } = process.env;

module.exports = (req, res, next) => {
  console.log(req.cookies.jwt);
  if (!req.cookies.jwt) {
    res.status(401).send({ message: '401: Неправильный email или пароль.' });
  }
  const token = req.cookies.jwt;

  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: '401: Неправильный email или пароль.' });
  }

  req.user = payload;

  return next();
};