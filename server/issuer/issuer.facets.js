'use strict';

const fs = require('fs');
const { issuer } = require('../config');

function profile() {
  return {
    id: issuer.issuerUrl,
    type: 'Issuer',
    name: issuer.name,
    telephone: issuer.telephone,
    description: issuer.description,
    image: issuer.imageUrl,
    email: issuer.email,
    publicKey: publicKey(),
    verificationObject: verificationObject(),
    revocationList: revocationList()
  };
}

function publicKey() {
  if (!issuer.publicKey) return null;
  return {
    id: issuer.publicKeyUrl,
    type: 'CryptographicKey',
    owner: issuer.issuerUrl,
    publicKeyPem: fs.readFileSync(issuer.publicKey, 'utf8')
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
