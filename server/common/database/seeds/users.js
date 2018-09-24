'use strict';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const { auth: config = {} } = require('../../../config');
const { role } = require('../../../../common/config');

const { ADMIN, INTEGRATION } = role;

const now = new Date();
const users = [{
  first_name: 'Admin',
  last_name: 'Example',
  username: 'admin@example.org',
  password: 'admin123',
  role: ADMIN,
  created_at: now,
  updated_at: now
}, {
  first_name: 'Admin2',
  last_name: 'Example',
  username: 'admin2@example.org',
  password: 'admin123',
  role: ADMIN,
  created_at: now,
  updated_at: now
}, {
  username: 'lms',
  password: 'admin123',
  role: INTEGRATION,
  created_at: now,
  updated_at: now
}, {
  username: 'tailor',
  password: 'admin123',
  role: INTEGRATION,
  created_at: now,
  updated_at: now
}];

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.map(users, user => {
      if (user.role === INTEGRATION) user.token = createToken(user);
      return encryptPassword(user);
    }).then(users => queryInterface.bulkInsert('user', users, {}));
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }
};

function createToken(user) {
  const payload = pick(user, ['id', 'username']);
  return jwt.sign(payload, config.secret);
}

function encryptPassword(user) {
  return bcrypt.hash(user.password, config.saltRounds)
    .then(password => (user.password = password))
    .then(() => user);
}
