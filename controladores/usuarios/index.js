'use strict';

const nuevoUsuario = require('./nuevoUsuario');
const usuarioValidado = require('./usuarioValidado');
const loginUsuario = require('./loginUsuario');
const usuarioInfo = require('./usuarioInfo');
const editaContrasenaUsuario = require('./editaContrasenaUsuario');
const borraUsuario = require('./borraUsuario');
const editaUsuario = require('./editaUsuario');
const recuperaContrasena = require('./recuperaContrasena');
const nuevaContrasena = require('./nuevaContrasena');
const fotoAvatar = require('./fotoAvatar');

module.exports = {
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
};