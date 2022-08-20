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
  borroAvatar,
  loginAdmin,
} = require('./controladores/usuarios/index');
const {
  puedeEditarLugar,
  usuarioAutorizado,
  existeLugar,
  existeUsuario,
  esAdmin,
} = require('./middlewares/index');

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
app.delete('/usuarios/:id/avatar/:avatarId', usuarioAutorizado, borroAvatar);
app.post('/admin', loginAdmin);

app.post('/lugares', esAdmin, nuevoLugar);
app.get('/lugares', lugares);
app.get('/lugares/:id', lugar);
app.put('/lugares/:id', esAdmin, existeLugar, editaLugar);
app.post('/lugares/:id', usuarioAutorizado, existeLugar, denunciaLugar);
app.delete('/lugares/:id', esAdmin, existeLugar, borraLugar);
app.post('/lugares/:id/imagenes', esAdmin, existeLugar, fotoLugar);
app.delete(
  '/lugares/:id/imagenes/:imagenId',
  esAdmin,
  existeLugar,
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
