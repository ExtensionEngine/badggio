'use strict';

const crypto = require('crypto');
const hasha = require('hasha');

const now = new Date();
const salt = crypto.randomBytes(32).toString('hex');

const recipients = [{
  email: 'non_hashed@example.org',
  hash: null,
  salt: null,
  created_at: now,
  updated_at: now
}, {
  email: 'hashed_non_salted@example.org',
  hash: sha256('hashed_non_salted@example.org'),
  salt: null,
  created_at: now,
  updated_at: now
}, {
  email: 'hashed_and_salted@example.org',
  hash: sha256('hashed_and_salted@example.org' + salt),
  salt,
  created_at: now,
  updated_at: now
}];

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('recipient', recipients, {});
  },
  down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('recipient', null, {});
  }
};

function sha256(value) {
  return 'sha256$' + hasha(value, { algorithm: 'sha256' });
}
