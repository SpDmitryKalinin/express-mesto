const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');
const ServerError = require('../errors/ServerError');

// Функция получения всех карточек
const getCards = (req, res, next) => {
  Card.find({})
    .then((card) => {
      if (!card) {
        next(new NotFoundError('404: данные карточек не найдены'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('400: Некорректно внесены данные.'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

// Функция создания карточки
const createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('400: Некорректно внесены данные.'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

// Функция удаления карточки
const deleteCard = (req, res, next) => {
  const owner = req.user._id;
  Card.findByIdAndRemove(req.params._id)
    .then((card) => {
      if (!card) {
        next(new NotFoundError('404: данные карточек не найдены'));
      } else {
        if (String(card.owner) === owner) {
          res.send(card);
        }
        next(new Unauthorized('Нельзя удалять чужие карточки'));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('400: Некорректно внесены данные.'));
      } else {
        next(new ServerError('500: ошибка на сервере'));
      }
    });
};

// Функция лайка карточки
const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id, {
      $addToSet: { likes: req.user._id },
    }, { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('404: данные карточек не найдены'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('400: Некорректно внесены данные.'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

// Функция удаления карточки
const dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params._id,
    {
      $pull: { likes: req.user._id },
    },
    { new: true },
  )
    .then((card) => {
      if (!card) {
        next(new NotFoundError('404: данные карточек не найдены'));
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('400: Некорректно внесены данные.'));
      }
      next(new ServerError('500: ошибка на сервере'));
    });
};

module.exports = {
  getCards, createCard, deleteCard, likeCard, dislikeCard,
};
