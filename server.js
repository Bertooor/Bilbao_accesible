'use strict';

require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const fileUpload = require('express-fileupload');

const { PORT } = process.env;

const app = express();

const {
  newPlace,
  listPlaces,
  getPlace,
} = require('./controllers/places/index');
const newUser = require('./controllers/users/index');
const isUser = require('./middlewares/isUser');

app.use(morgan('dev'));

app.use(express.json());

app.use(fileUpload());

app.post('/users', newUser);

app.post('/places', isUser, newPlace);
app.get('/places', listPlaces);
app.get('/places/:id', getPlace);

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'Not found',
  });
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(error.httpStatus || 500).send({
    status: 'error',
    message: error.message,
  });
});

app.listen(PORT, () => {
  console.log(`Servidor activo en http://127.0.0.1:${PORT}`);
});
