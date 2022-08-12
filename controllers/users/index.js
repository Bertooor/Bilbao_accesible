'use strict';

const newUser = require('./newUser');
const validateUser = require('./validateUser');
const loginUser = require('./loginUser');
const getUser = require('./getUser');
const editUserPwd = require('./editUserPwd');

module.exports = { newUser, validateUser, loginUser, getUser, editUserPwd };
