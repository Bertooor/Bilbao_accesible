'use strict';

const jwt = require('jsonwebtoken');

const getDB = require('../../db/db');
const { validate, generateError } = require('../../helpers');
const registrationSchema = require('../../schemas');

const loginUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    await validate(registrationSchema, req.body);

    const { email, password } = req.body;

    const [user] = await connection.query(
      `
      SELECT id, role, active
      FROM users
      WHERE email = ? AND password = SHA2(?, 512)
    `,
      [email, password]
    );

    if (user.length === 0) {
      generateError('Email o password no correctos', 401);
    }

    if (!user[0].active) {
      generateError('Usuario pendiente de validación, revise su correo', 401);
    }

    const info = {
      id: user[0].id,
      role: user[0].role,
    };

    const token = jwt.sign(info, process.env.JWT_SECRET, { expiresIn: '1d' });

    res.send({
      status: 'ok',
      data: {
        token,
      },
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = loginUser;
