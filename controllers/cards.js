const Card = require('../models/card');

//Функция получения всех карточек
const getCards = (req, res) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: '404: данные карточек не найдены'});
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: '400: Некорректно внесены данные.'});
      }
      res.status(500).send({ message: '500: Ошибка на стороне сервера.'});
    });
};


//Функция создания карточки
const createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: '400: Некорректно внесены данные.'});
      }
      return res.status(500).send(err);
    });
};

//Функция удаления карточки
const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: '404: данные карточки не найдены.'});
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: '400: Некорректно внесены данные.'});
      }
      res.status(500).send({ message: '500: Ошибка на стороне сервера.'});
    });
};

//Функция лайка карточки
const likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id, {
      $addToSet: { likes: req.user._id },
    }, { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({message: '404: данные карточки не найдены.'});
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: '400: Некорректно внесены данные.'});
      }
      res.status(500).send({ message: '500: Ошибка на стороне сервера.'});
    });
};

//Функция удаления карточки
const dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: '404: данные карточки не найдены.'});
        return;
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: '400: Некорректно внесены данные.'});
      }
      res.status(500).send({ message: '500: Ошибка на стороне сервера.'});
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard
};