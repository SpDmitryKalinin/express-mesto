const errorsHandler = (err, req, res, next) => {
  const status = err.statusCode || 501;
  const response = err.message || '501: Ошибка на стороне сервера';

  res.status(status).send({ response });

  next();
};

module.exports = errorsHandler;
