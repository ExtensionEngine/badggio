'use strict';

const ajv = require('../common/ajv');
const explorer = require('cosmiconfig')('issuer');
const fs = require('fs');
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

  const load = {
    imageUrl: SERVER_URL + paths.root + paths.image,
    issuerUrl: SERVER_URL + paths.root + paths.issuer,
    publicKeyUrl: SERVER_URL + paths.root + paths.publicKey,
    revocationListUrl: SERVER_URL + paths.root + paths.revocationList
  };

  if (issuer.publicKeyPath) {
    load.publicKey = fs.readFileSync(issuer.publicKeyPath, 'utf8');
    load.privateKey = fs.readFileSync(issuer.privateKeyPath, 'utf8');
  }

  return Object.assign({}, issuer, load);
}

module.exports = { load };
