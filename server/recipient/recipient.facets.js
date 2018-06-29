'use strict';

const hasha = require('hasha');
const pickBy = require('lodash/pickBy');

function hash(email, salt) {
  if (!salt) salt = '';
  return 'sha256$' + hasha(email + salt, { algorithm: 'sha256' });
}

function identityObject({ email, hashed, salted, salt }) {
  return Object.assign(
    { hashed, type: 'email' },
    { identity: (salted || hashed) ? hash(email, salt) : email },
    pickBy({ salt })
  );
}

module.exports = {
  identityObject
};
