'use strict';

const getDB = require('../../db/db');
const {
  generateError,
  generateRandomString,
  sendEmail,
} = require('../../helpers');

const recoverUserPassword = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { email } = req.body;

    if (!email) {
      generateError('Faltan campos', 400);
    }

    const [currentEmail] = await connection.query(
      `
            SELECT id
            FROM users
            WHERE email = ?
        `,
      [email]
    );

    if (currentEmail.length === 0) {
      generateError('No hay ningún usuario registrado con este email');
    }

    const recoverCode = generateRandomString(40);

    const emailBody = `
            Se solicitó un cambio de contraseña para el usuario registrado con este email en Bilbao_accesible.

            El código de recuperación es: ${recoverCode}.

            Si no fuiste tu el que solicitó el cambio, ignora este email y sigue con tu contraseña habitual.

            ¡ Gracias !
        `;

    await connection.query(
      `
            UPDATE users
            SET recoverCode = ? 
            WHERE email = ?
        `,
      [recoverCode, email]
    );

    await sendEmail({
      to: email,
      subject: `Cambio de contraseña en Bilbao_accesible.`,
      body: emailBody,
    });

    res.send({
      status: 'ok',
      message: 'Revisa tu correo para cambiar tu contraseña.',
    });
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = recoverUserPassword;
