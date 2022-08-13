'use strict';

const registrationSchema = require('../../schemas');
const {
  validate,
  generateRandomString,
  sendEmail,
  generateError,
} = require('../../helpers');
const getDB = require('../../db/db');

const newUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    await validate(registrationSchema, req.body);

    const { email, password, avatar } = req.body;

    const [existingUser] = await connection.query(
      `
      SELECT id
      FROM users
      WHERE email = ?
    `,
      [email]
    );

    if (existingUser.length > 0) {
      generateError('Ya existe un usuario con este email', 409);
    }

    const registrationCode = generateRandomString(40);

    const bodyEmail = `
      Acabas de registrarte en Bilbao_accesible.
      Pulsa en este enlac para activar el usuario: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
    `;

    sendEmail({
      to: email,
      subject: 'Correo de activación de usuario',
      body: bodyEmail,
    });

    await connection.query(
      `
      INSERT INTO users (created_at, avatar, email, password, registrationCode)
      VALUES (CURRENT_TIMESTAMP, ?, ?, SHA2(?, 512), ?)
    `,
      [avatar, email, password, registrationCode]
    );

    res.status(201).send({
      status: 'ok',
      message: 'Usuario creado, comprueba tu correo para activarlo',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = newUser;
