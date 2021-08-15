const User = require("../models/user");

//Функция получения данных всех пользователей
const getUsers = (req, res) =>{
  User.find({}).then((users) => {
    res.status(200).send(users)
  })
  .catch(() =>{
    res.status(500).send({message: "500: ошибка на сервере"});
  })
}

//Функция получения данных пользователя
const getUser = (req, res) => {
  User.findById(req.params._id)
  .then((user) => {
    if(user === null){
      return res.status(404).send({ message: "404: Пользователь с указанным id не найден"});
    }
    else{
      return res.status(200).send(user);
    }
  })
  .catch((err) => {
    if (err.name === 'CastError'){
      return res.status(400).send({ message: "400: Ошибка в запросе" });
    }
    else{
      return res.status(500).send({ message: "500: ошибка на сервере" });
    }
  })
}

//Функция создания пользователя
const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({name, about, avatar})
    .then((user) => {
      return res.status(200).send(user);
    })
    .catch((err) => {
    if (err.name === 'ValidationError') {
      return res.status(400).send({ message: '400: Данные введены некорректно' });
    }
    return res.status(500).send({ message: '500: Ошибка на сервере' });
  });
}

//Функция обновления имени и описания пользователя
const updateUser = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).res.send({ message: '404: Пользователя с данным ID нет в БД.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: '400: Данные внесены некорректно.' });
      }
      res.status(500).send({ message: '500: Запрашиваемый ресурс не найден.' });
    });
};

//Функция обновления аватара пользователя
const updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        return res.status(404).res.send({ message: '404: Пользователя с данным ID нет в БД.' });
      }
      return res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        res.status(400).send({ message: '400: Данные внесены некорректно.' });
      }
      res.status(500).send({ message: '500: Запрашиваемый ресурс не найден.' });
    });
};


module.exports = {getUsers, getUser, createUser, updateUser, updateAvatar};

