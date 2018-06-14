'use strict';

const ajv = require('../common/ajv');
const explorer = require('cosmiconfig')('issuer');
const fs = require('fs');
const paths = require('./issuer.paths');
const pickBy = require('lodash/pickBy');
const schema = require('./issuer.schema.json');
const { SERVER_URL } = process.env;

const issuer = explorer.searchSync().config;

function url(...paths) {
  return [SERVER_URL, ...paths].join('');
}

function urls() {
  const urls = {
    issuerUrl: url(paths.root, paths.issuer)
  };
  if (issuer.imagePath) urls.imageUrl = url(paths.root, paths.image);
  if (issuer.publicKeyPath) urls.publicKeyUrl = url(paths.root, paths.publicKey);
  return urls;
}

/**
 * Loads Issuer based on given configuration in `.issuerrc.json` file.
 *
 * Changes Issuer instance - removes falsy and adds
 * additional (constant and calculated) properties.
 * @throws {Error} Invalid configuration errors.
 * @returns {object} Issuer.
 */
function load() {
  const valid = ajv.validate(schema, issuer);
  if (!valid) {
    throw new Error(ajv.errors.map(error =>
      `Issuer${error.dataPath}: ${error.message}`).join(', '));
  }

  if (issuer.publicKeyPath) {
    issuer.publicKey = fs.readFileSync(issuer.publicKeyPath, 'utf8');
    issuer.privateKey = fs.readFileSync(issuer.privateKeyPath, 'utf8');
  }

  Object.assign(issuer, urls());
  return pickBy(issuer);
}

module.exports = { load };
