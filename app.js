const express = require('express');
const mongoose = require('mongoose');
const { createUser, login } = require('./controllers/users');
const cookieParser = require('cookie-parser');
const auth = require("./middlewares/auth");

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use('/', userRouter);
app.use('/', cardsRouter);
app.post('/signin', login);
app.post('/signup', createUser);
// app.use(auth);
app.use('*', (req, res) => res.status(404).send({ message: 'Ресурс не найден.' }));
app.listen(PORT, () => {
  console.log('start server');
});
