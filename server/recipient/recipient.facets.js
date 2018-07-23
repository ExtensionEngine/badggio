'use strict';

const pickBy = require('lodash/pickBy');

function identityObject({ email, hash, salt }) {
  return Object.assign({
    identity: hash || email,
    hashed: Boolean(hash),
    type: 'email'
  }, pickBy({ salt }));
}

module.exports = {
  identityObject
};
