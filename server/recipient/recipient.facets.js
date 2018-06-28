'use strict';

const hasha = require('hasha');

function hash(email, salt = '') {
  return 'sha256$' + hasha(email + salt, { algorithm: 'sha256' });
}

function hashRecipient({ email, hashed, salt }) {
  if (!hashed) return { identity: email, hashed };
  if (!salt) return { identity: hash(email), hashed };
  return { identity: hash(email, salt), hashed, salt };
}

function identityObject(recipient) {
  return Object.assign({ type: 'email' }, hashRecipient(recipient));
}

module.exports = {
  identityObject
};
