'use strict';

const crypto = require('crypto');

const now = new Date();
const recipients = [{
  email: 'non_hashed@example.org',
  hashed: false,
  salt: null,
  created_at: now,
  updated_at: now
}, {
  email: 'hashed_non_salted@example.org',
  hashed: true,
  salt: null,
  created_at: now,
  updated_at: now
}, {
  email: 'hashed_and_salted@example.org',
  hashed: true,
  salt: crypto.randomBytes(32).toString('hex'),
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
