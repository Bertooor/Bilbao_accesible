'use strict';

const getPlace = (req, res, next) => {
  res.send({
    status: 'ok',
    message: 'Detalle del lugar',
    data: {},
  });
};

module.exports = getPlace;
