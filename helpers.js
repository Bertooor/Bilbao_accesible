'use strict';

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');
const crypto = require('crypto');
const sgEmail = require('@sendgrid/mail');

sgEmail.setApiKey(process.env.SENDGRID_API_KEY);

const { UPLOAD_DIRECTORY_ADMIN } = process.env;
const photosAdminDir = path.join(__dirname, UPLOAD_DIRECTORY_ADMIN);

async function savePhoto(dataPhoto) {
  await fs.access(photosAdminDir);

  const imageAd = sharp(dataPhoto.data);

  const imageAdName = `upload_${uuid.v4()}_${dataPhoto.name}`;

  await imageAd.toFile(path.join(photosAdminDir, imageAdName));
  return imageAdName;
}

async function deletePhoto(photo) {
  const photoPath = path.join(photosAdminDir, photo);
  await fs.unlink(photoPath);
}

async function validate(schema, data) {
  try {
    await schema.validateAsync(data);
  } catch (error) {
    error.httpStatus = 400;
    throw error;
  }
}

function generateRandomString(byteString) {
  return crypto.randomBytes(byteString).toString('hex');
}

async function sendEmail({ to, subject, body }) {
  try {
    const msg = {
      to,
      from: process.env.SENDGRID_FROM,
      subject,
      text: body,
      html: `
      <div>
      <h1>${subject}</h1>
      <p>${body}</p>
      </div>
      `,
    };
    await sgEmail.send(msg);
  } catch (error) {
    throw new Error('Error enviando email');
  }
}

function generateError(msg, statusCode) {
  const error = new Error(msg);
  error.httpStatus = statusCode;
  throw error;
}

module.exports = {
  savePhoto,
  deletePhoto,
  validate,
  generateRandomString,
  sendEmail,
  generateError,
};
