'use strict';

const listPlaces = (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Listado de lugares',
    data: {},
  });
};

const getPlace = (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Detalle del lugar',
    data: {},
  });
};

const newPlace = (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Nuevo lugar',
    data: {},
  });
};

module.exports = { listPlaces, getPlace, newPlace };
