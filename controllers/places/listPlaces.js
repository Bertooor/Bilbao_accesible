'use strict';

const listPlaces = (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Listado de lugares',
    data: {},
  });
};

module.exports = listPlaces;
