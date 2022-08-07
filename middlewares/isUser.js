'use strict';

const isUser = (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      const error = new Error(`Falta la cabecera de authorization`);
      error.httpStatus = 401;
      throw error;
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isUser;
