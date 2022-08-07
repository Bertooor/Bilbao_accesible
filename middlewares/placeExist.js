'use strict';
const placeExist = (req, res, next) => {
  try {
    console.log('placeExist');
    next();
  } catch (error) {
    next(error);
  }
};
module.exports = placeExist;
