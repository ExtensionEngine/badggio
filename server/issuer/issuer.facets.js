'use strict';

const { issuer } = require('../config');

function profile() {
  return {
    id: issuer.issuerUrl,
    type: 'Issuer',
    name: issuer.name,
    url: issuer.url,
    telephone: issuer.telephone,
    description: issuer.description,
    image: issuer.imageUrl,
    email: issuer.email,
    publicKey: (issuer.publicKey) ? publicKey() : undefined,
    verification: verificationObject(),
    revocationList: issuer.revocationListUrl
  };
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

function revocationList() {
  // TODO: add revokedAssertions property
  return {
    type: 'RevocationList',
    issuer: issuer.issuerUrl
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
  revocationList,
  verificationObject
};
