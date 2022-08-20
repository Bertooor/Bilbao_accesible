'use strict';

const puedeEditarLugar = require('./puedeEditarLugar');
const usuarioAutorizado = require('./usuarioAutorizado');
const existeLugar = require('./existeLugar');
const existeUsuario = require('./existeUsuario');
const esAdmin = require('./esAdmin');

module.exports = {
  puedeEditarLugar,
  usuarioAutorizado,
  existeLugar,
  existeUsuario,
  esAdmin,
};
