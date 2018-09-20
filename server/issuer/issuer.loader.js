'use strict';

const ajv = require('../common/ajv');
const fs = require('fs');
const JoyCon = require('joycon');
const paths = require('./issuer.paths');
const pickBy = require('lodash/pickBy');
const schema = require('./issuer.schema.json');
const { SERVER_URL } = process.env;

const { data: issuer } = new JoyCon().loadSync({ files: ['.issuerrc.json'] });

function loadKeyPairs() {
  if (!issuer.publicKeyPath) return {};
  return {
    publicKey: fs.readFileSync(issuer.publicKeyPath, 'utf8'),
    privateKey: fs.readFileSync(issuer.privateKeyPath, 'utf8')
  };
}

function loadUrls() {
  const rootUrl = SERVER_URL + paths.root;
  const urls = {
    issuerUrl: rootUrl + paths.issuer
  };
  if (issuer.imagePath) urls.imageUrl = rootUrl + paths.image;
  if (issuer.publicKeyPath) urls.publicKeyUrl = rootUrl + paths.publicKey;
  return urls;
}

/**
 * Loads Issuer based on given configuration in `.issuerrc.json` file.
 *
 * Changes Issuer:
 *  - loads Issuer urls
 *  - loads Issuer keys (public and private)
 *  - removes falsy properties
 * @throws {Error} Invalid configuration errors.
 * @returns {object} Issuer.
 */
function load() {
  const valid = ajv.validate(schema, issuer);
  if (!valid) {
    throw new Error(ajv.errors.map(error =>
      `Issuer${error.dataPath}: ${error.message}`).join(', '));
  }

  Object.assign(issuer, loadUrls(), loadKeyPairs());
  return pickBy(issuer);
}

module.exports = { load };
