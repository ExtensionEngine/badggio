'use strict';

const bcrypt = require('bcrypt');
const hasha = require('hasha');
const Promise = require('bluebird');
const { auth: config = {} } = require('../../../config');
const { role } = require('../../../../common/config');

const now = new Date();
const users = [{
  first_name: 'Admin',
  last_name: 'Example',
  email: 'admin@example.org',
  password: 'admin123',
  role: role.ADMIN,
  created_at: now,
  updated_at: now
}, {
  first_name: 'Admin2',
  last_name: 'Example',
  email: 'admin2@example.org',
  password: 'admin123',
  role: role.ADMIN,
  created_at: now,
  updated_at: now
}, {
  first_name: 'lms',
  role: 'INTEGRATION',
  created_at: now,
  updated_at: now
}, {
  first_name: 'tailor',
  role: 'INTEGRATION',
  created_at: now,
  updated_at: now
}];

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.map(users, user => {
      if (user.role !== 'INTEGRATION') encryptPassword(user);
      else user.email = `${sha1(user.first_name, 14)}@integration.localhost`;
      return user;
    })
      .then(users => queryInterface.bulkInsert('user', users, {}));
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('user', null, {});
  }
};

function encryptPassword(user) {
  return bcrypt.hash(user.password, config.saltRounds)
    .then(password => (user.password = password))
    .then(() => user);
}

function sha1(input, length) {
  const hash = hasha(input, { algorithm: 'sha1' });
  return hash.substring(hash.length - length);
}
