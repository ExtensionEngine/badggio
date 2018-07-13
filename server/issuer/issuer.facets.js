'use strict';

const pickBy = require('lodash/pickBy');
const { base: facetBase, verificationObject } = require('../common/facets');
const { issuer } = require('../config');
const { revocationListIri } = require('../assertion/assertion.facets');

function profile() {
  return pickBy(Object.assign(facetBase(), {
    id: issuer.issuerUrl,
    type: 'Issuer',
    name: issuer.name,
    url: issuer.url,
    telephone: issuer.telephone,
    description: issuer.description,
    image: issuer.imageUrl,
    email: issuer.email,
    publicKey: issuer.publicKeyUrl,
    verification: verificationObject(),
    revocationList: revocationListIri()
  }));
}

function publicKey() {
  if (!issuer.publicKey) return null;
  return Object.assign(facetBase(), {
    id: issuer.publicKeyUrl,
    type: 'CryptographicKey',
    owner: issuer.issuerUrl,
    publicKeyPem: issuer.publicKey
  });
}

module.exports = {
  profile,
  publicKey
};
