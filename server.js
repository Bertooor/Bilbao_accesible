'use strict';

require('dotenv').config();

const express = require('express');

const morgan = require('morgan');

const path = require('path');

const fileUpload = require('express-fileupload');

const { PORT, DIRECTORIO_IMAGENES } = process.env;

const app = express();

const {
  nuevoLugar,
  lugares,
  lugar,
  editaLugar,
  borraLugar,
  fotoLugar,
  borraFotoLugar,
  denunciaLugar,
} = require('./controladores/lugares/index');
const {
  nuevoUsuario,
  usuarioValidado,
  loginUsuario,
  usuarioInfo,
  editaContrasenaUsuario,
  borraUsuario,
  editaUsuario,
  recuperaContrasena,
  nuevaContrasena,
  fotoAvatar,
} = require('./controladores/usuarios/index');
const {
  puedeEditarLugar,
  usuarioAutorizado,
  existeLugar,
  existeUsuario,
} = require('./middlewares');

app.use(morgan('dev'));

app.use(express.json());

app.use(express.static(path.join(__dirname, DIRECTORIO_IMAGENES)));

app.use(fileUpload());

app.post('/usuarios', nuevoUsuario);
app.get('/usuarios/validar/:registrationCode', usuarioValidado);
app.post('/usuarios/login', loginUsuario);
app.get('/usuarios/:id', existeUsuario, usuarioAutorizado, usuarioInfo);
app.put('/usuarios/contrasena', usuarioAutorizado, editaContrasenaUsuario);
app.delete('/usuarios/:id', existeUsuario, usuarioAutorizado, borraUsuario);
app.put('/usuarios/:id', existeUsuario, usuarioAutorizado, editaUsuario);
app.post('/usuarios/recuperaContrasena', recuperaContrasena);
app.post('/usuarios/nuevaContrasena', nuevaContrasena);
app.post('/usuarios/:id/avatar', usuarioAutorizado, fotoAvatar);

app.post('/lugares', usuarioAutorizado, nuevoLugar);
app.get('/lugares', lugares);
app.get('/lugares/:id', lugar);
app.put(
  '/lugares/:id',
  usuarioAutorizado,
  existeLugar,
  puedeEditarLugar,
  editaLugar
);
app.post('/lugares/:id/', usuarioAutorizado, existeLugar, denunciaLugar);
app.delete(
  '/lugares/:id',
  usuarioAutorizado,
  existeLugar,
  puedeEditarLugar,
  borraLugar
);
app.post(
  '/lugares/:id/photos',
  usuarioAutorizado,
  existeLugar,
  puedeEditarLugar,
  fotoLugar
);
app.delete(
  '/lugares/:id/photos/:photoID',
  usuarioAutorizado,
  existeLugar,
  puedeEditarLugar,
  borraFotoLugar
);

app.use((req, res) => {
  res.status(404).send({
    status: 'error',
    message: 'No encontrado',
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
