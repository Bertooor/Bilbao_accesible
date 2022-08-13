'use strict';

const newUser = require('./newUser');
const validateUser = require('./validateUser');
const loginUser = require('./loginUser');
const getUser = require('./getUser');
const editUserPwd = require('./editUserPwd');
const deleteUser = require('./deleteUser');
const editUser = require('./editUser');

module.exports = {
  newUser,
  validateUser,
  loginUser,
  getUser,
  editUserPwd,
  deleteUser,
  editUser,
};
