'use strict';

const newUser = (req, res, next) => {
  res.status(201).send({
    status: 'ok',
    message: 'Usuario creado',
    data: 1,
  });
};

module.exports = { newUser };
