'use strict';

const ajv = require('../common/ajv');
const explorer = require('cosmiconfig')('issuer');
const paths = require('./issuer.paths');
const schema = require('./issuer.schema.json');
const { SERVER_URL } = process.env;

const issuer = explorer.searchSync().config;

function load() {
  const valid = ajv.validate(schema, issuer);
  if (!valid) {
    throw new Error(ajv.errors.map(error =>
      `Issuer${error.dataPath}: ${error.message}`).join(', '));
  }

  const issuerUrl = SERVER_URL + paths.root + paths.issuer;
  const imageUrl = SERVER_URL + paths.root + paths.image;
  const publicKeyUrl = SERVER_URL + paths.root + paths.publicKey;
  return Object.assign({}, issuer, { issuerUrl, imageUrl, publicKeyUrl });
}

module.exports = { load };
