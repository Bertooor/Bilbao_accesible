'use strict';

const getDB = require('../db/db');
const jwt = require('jsonwebtoken');
const { generateError } = require('../helpers');

const isUser = async (req, res, next) => {
  let connection;
  try {
    connection = await getDB();

    const { authorization } = req.headers;
    console.log('authorization', authorization);

    if (!authorization) {
      generateError('Falta la cabecera de authorization', 401);
    }

    let tokenInfo;
    try {
      tokenInfo = jwt.verify(authorization, process.env.JWT_SECRET);
    } catch (error) {
      generateError('Token no valido', 401);
    }
    console.log('tokenInfo', tokenInfo);
    const [user] = await connection.query(
      `
      SELECT lastAuthUpdate
      FROM users
      WHERE id = ?
    `,
      [tokenInfo.id]
    );
    console.log('user', user);
    const lastAuthUpdate = new Date(user[0].lastAuthUpdate);
    const timestampCreateToken = tokenInfo.iat;

    console.log('last', Date.parse(lastAuthUpdate) / 1000);
    console.log('time', timestampCreateToken);

    if (timestampCreateToken < Date.parse(lastAuthUpdate) / 1000) {
      generateError('Token caducado', 401);
    }

    req.userAuth = tokenInfo;
    next();
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = isUser;
