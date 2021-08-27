const User = require('../models/user');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Функция получения данных всех пользователей
const getUsers = (req, res) => {
  User.find({}).then((users) => {
    res.status(200).send(users);
  })
    .catch(() => {
      res.status(500).send({ message: '500: ошибка на сервере' });
    });
};

// Функция получения данных пользователя
const getUser = (req, res) => {
  User.findById(req.params._id)
    .then((user) => {
      if (user === null) {
        return res.status(404).send({ message: '404: Пользователь с указанным id не найден' });
      }

      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: '400: Ошибка в запросе' });
      }

      return res.status(500).send({ message: '500: ошибка на сервере' });
    });
};

// Функция создания пользователя
const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  bcrypt.hash(password, 10).then(hash => User.create({ name, about, avatar, email, password: hash}))

    .then((user) => res.status(200).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: '400: Данные введены некорректно' });
      }
      return res.status(500).send({ message: '500: Ошибка на сервере' });
    });
};

// Функция обновления имени и описания пользователя
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: '404: Пользователя с данным ID нет в БД.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: '400: Данные внесены некорректно.' });
      }
      res.status(500).send({ message: '500: Ошибка на сервере.' });
    });
};

// Функция обновления аватара пользователя
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).send({ message: '404: Пользователя с данным ID нет в БД.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: '400: Данные внесены некорректно.' });
      }
      res.status(500).send({ message: '500: Ошибка на сервере.' });
    });
};

// Функция логин
 const login = (req, res) =>{
    const {email, password} = req.body;
//   User.findOne({email}).select('+password')
//     .then((user)=>{
//       bcrypt.compare(password, user.password)
//       .then((mathed) =>{
//         if(!mathed){
//           res.status(401).send({ message: '401: Неправильный пароль.' });
//         }
//         const token = jwt.sign({ _id: user._id }, { expiresIn: '7d' });
//         console.log(token);
//         return res.cookie('jwt', token, {
//           maxAge: 3600000 * 24 * 7,
//           httpOnly: true});
//       })
//     })
//
  User.findOne({email}).select('+password').then(()=>{
    console.log("!!!");
  })
  .catch((err) => {
    if (err.message === "IncorrectEmail") {
      res.status(401).send({ message: '401: Неправильный email или пароль.' });
    }
    res.status(500).send({ message: '500: Ошибка на сервере.' });
  });
}

// Информация о себе

const getMyInfo = (req, res) => {
  User.findById(req.user._id)
    .then((user) => { res.status(200).send(user); })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(401).send({ message: '401: Неправильный email или пароль.' });
      }
      res.status(500).send({ message: '500: Ошибка на сервере.' });
    });
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateAvatar, login, getMyInfo
};
