'use strict';

const getDB = require('../../db/db');
const {
  generateError,
  savePhoto,
  generateRandomString,
  sendEmail,
} = require('../../helpers');

const editUser = async (req, res, next) => {
  let connection;

  try {
    connection = await getDB();

    const { id } = req.params;

    const { name, email } = req.body;

    if (req.userAuth.id !== Number(id) && req.userAuth.role !== 'admin') {
      generateError('No tienes permisos para editar este usuario', 403);
    }

    const [currentUser] = await connection.query(
      `
            SELECT email
            FROM users
            WHERE id = ?
        `,
      [id]
    );

    if (req.files.avatar) {
      const userAvatar = await savePhoto(req.files.avatar);
      await connection.query(
        `
                UPDATE users
                SET avatar = ?
                WHERE id = ?
            `,
        [userAvatar, id]
      );
    }

    if (email !== currentUser[0].email) {
      const [existingEmail] = await connection.query(
        `
            SELECT id
            FROM users
         WHERE email = ?
        `,
        [email]
      );

      if (existingEmail.length > 0) {
        generateError('Ya existe un usuario con el email proporcionado', 409);
      }

      const registrationCode = generateRandomString(40);

      const emailBody = `
            Acabas de modificar tu email en Bilbao_accesible.
            Pulsa en este link para validar tu nuevo email: ${process.env.PUBLIC_HOST}/users/validate/${registrationCode}
        `;

      await sendEmail({
        to: email,
        subject: 'Confirma tu nuevo email',
        body: emailBody,
      });

      await connection.query(
        `
            UPDATE users
            SET name = ?, email = ?, lastAuthUpdate = ?, active = 0, registrationCode = ? 
            WHERE id = ?
        `,
        [name, email, new Date(), registrationCode, id]
      );

      res.send({
        status: 'ok',
        message:
          'Datos de usuario actualizados. Mira tu email para validar los nuevos datos',
      });
    } else {
      await connection.query(
        `
            UPDATE users
            SET name = ?
            WHERE id = ?
        `,
        [name, id]
      );

      res.send({
        status: 'ok',
        message: 'Datos de usuario actualizados',
      });
    }
  } catch (error) {
    next(error);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = editUser;
