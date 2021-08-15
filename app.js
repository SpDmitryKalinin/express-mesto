const express = require ("express");
const mongoose = require ("mongoose");

const userRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');
const {PORT = 3000} = process.env;


mongoose.connect('mongodb://localhost:27017/mestodb', {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false
});

const app = express();
app.use((req, res, next) => {
  req.user = {
    _id: '611934dd448dcd37f04438ff'
  };
  next();
});
app.use(express.json())
app.use('/', userRouter);
app.use('/', cardsRouter);
app.use('*', (req, res) => res.status(404).send({ message: 'Ресурс не найден.' }));
app.listen(PORT, () =>{
  console.log('start server')
});