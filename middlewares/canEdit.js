'use strict';

const canEdit = (req, res, next) => {
  try {
    console.log('canEdit');
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = canEdit;
