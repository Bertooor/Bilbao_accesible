'use strict';

const getPlace = require('./getPlace');
const listPlaces = require('./listPlaces');
const newPlace = require('./newPlace');
const editPlace = require('./editPlace');
const complaintPlace = require('./complaintPlace');
const deletePlace = require('./deletePlace');

module.exports = {
  complaintPlace,
  getPlace,
  listPlaces,
  newPlace,
  editPlace,
  deletePlace,
};
