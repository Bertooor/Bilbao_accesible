'use strict';

const newUser = require('./newUser');
const validateUser = require('./validateUser');
const loginUser = require('./loginUser');
const getUser = require('./getUser');
const editUserPwd = require('./editUserPwd');
const deleteUser = require('./deleteUser');
const editUser = require('./editUser');
const recoverUserPassword = require('./recoverUserPassword');
const resetUserPassword = require('./resetUserPassword');

module.exports = {
  newUser,
  validateUser,
  loginUser,
  getUser,
  editUserPwd,
  deleteUser,
  editUser,
  recoverUserPassword,
  resetUserPassword,
};
