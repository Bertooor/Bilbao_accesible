'use strict';

require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const path = require('path');

const fileUpload = require('express-fileupload');

const { PORT, UPLOAD_DIRECTORY_ADMIN } = process.env;

const app = express();

const {
  complaintPlace,
  newPlace,
  listPlaces,
  getPlace,
  editPlace,
  deletePlace,
  addPlacePhoto,
  deletePlacePhoto,
} = require('./controllers/places/index');
const {
  newUser,
  validateUser,
  loginUser,
  getUser,
  editUserPwd,
} = require('./controllers/users/index');
const { canEdit, isUser, placeExist, userExist } = require('./middlewares');

app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(path.join(__dirname, UPLOAD_DIRECTORY_ADMIN)));

app.use(fileUpload());

app.post('/users', newUser);
app.get('/users/validate/:registrationCode', validateUser);
app.post('/users/login', loginUser);
app.get('/users/:id', isUser, userExist, getUser);
app.put('/users/password', isUser, editUserPwd);

app.post('/places', isUser, newPlace);
app.get('/places', listPlaces);
app.get('/places/:id', getPlace);
app.put('/places/:id', isUser, placeExist, canEdit, editPlace);
app.post('/places/:id/', isUser, placeExist, complaintPlace);
app.delete('/places/:id', isUser, placeExist, canEdit, deletePlace);
app.post('/places/:id/photos', isUser, placeExist, canEdit, addPlacePhoto);
app.delete(
  '/places/:id/photos/:photoID',
  isUser,
  placeExist,
  canEdit,
  deletePlacePhoto
);

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
