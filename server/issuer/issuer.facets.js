'use strict';

const pickBy = require('lodash/pickBy');
const { issuer } = require('../config');

function profile() {
  return pickBy({
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
    // TODO: load from assertion.paths.js once created
    revocationList: 'http://example.org/assertions/revocationList.json'
  });
}

function publicKey() {
  if (!issuer.publicKey) return null;
  return {
    id: issuer.publicKeyUrl,
    type: 'CryptographicKey',
    owner: issuer.issuerUrl,
    publicKeyPem: issuer.publicKey
  };
}

function verificationObject() {
  // TODO: add verificationProperty, startsWith and allowedOrigins properties
  if (!issuer.publicKey) {
    return { type: 'HostedBadge' };
  }
  return {
    type: 'SignedBadge',
    creator: issuer.publicKeyUrl
  };
}

module.exports = {
  profile,
  publicKey,
  verificationObject
};
