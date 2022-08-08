'use strict';

const fs = require('fs/promises');
const path = require('path');
const sharp = require('sharp');
const uuid = require('uuid');

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

module.exports = { savePhoto, deletePhoto };
