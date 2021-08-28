const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');
const ServerError = require('../errors/ServerError');
const Conflict = require('../errors/Conflict');

// Функция получения данных всех пользователей
const getUsers = (req, res, next) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  })
    .catch(() => {
      next(new ServerError('500: ошибка на сервере'));
    });
};

// Функция получения данных пользователя
const getUser = (req, res, next) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        next(new NotFoundError('404: Пользователь с указанным id не найден'));
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('400: Ошибка в запросе'));
      }

      next(new ServerError('500: ошибка на сервере'));
    });
};

// Функция создания пользователя

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  User.findOne({ email }).then((user) => {
    if (user) {
      next(new Conflict('409:Пользователь с таким email существует'));
    }
    bcrypt.hash(password, 10)
      .then((hash) => {
        User.create({
          name, about, avatar, email, password: hash,
        })
          .then(({
            name, about, avatar, email,
          }) => {
            res.status(200).send({
              data: {
                name, about, avatar, email,
              },
            });
          })
          .catch((err) => {
            if (err.name === 'ValidationError') {
              next(new BadRequest('400: Ошибка в запросе'));
            }
            next(new ServerError('500: ошибка на сервере'));
          });
      })
      .catch(() => {
        next(new ServerError('500: ошибка на сервере'));
      });
  });
};

// Функция обновления имени и описания пользователя
const updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('404: Пользователя с данным ID нет в БД.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('400: Ошибка в запросе'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

// Функция обновления аватара пользователя
const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        next(new NotFoundError('404: Пользователя с данным ID нет в БД.'));
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        next(new BadRequest('400: Ошибка в запросе'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

// Функция логин
const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        next(new Unauthorized('401: Неправильный пароль.'));
      }
      return bcrypt.compare(password, user.password)
        .then((mathed) => {
          if (!mathed) {
            next(new Unauthorized('401: Неправильный пароль.'));
          }
          return user;
        });
    })

    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'secret-key', { expiresIn: '7d' });
      return res
        .status(201)
        .cookie('jwt', token, {
          maxAge: 3600000 * 24 * 7,
          httpOnly: true,
        })
        .send({ message: 'Авторизация успешно пройдена', token });
    })

    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new Unauthorized('401: Неправильный пароль.'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

// Информация о себе

const getMyInfo = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new Unauthorized('401: Неправильный пароль.'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getMyInfo,
};
