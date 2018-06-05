'use strict';

const config = require('../config');
const issuer = require('./issuer.config');
const publicKeyJsonUrl = config.hostname + '/publicKey.json';
const issuerJsonUrl = config.hostname + '/issuer.json';
const issuerImageUrl = config.hostname + '/issuer-image';

function getBulk() {
  return {
    id: issuerJsonUrl,
    type: 'Issuer',
    name: issuer.name,
    telephone: issuer.telephone,
    description: issuer.description,
    image: issuerImageUrl,
    email: issuer.email,
    publicKey: getPublicKeyBulk(),
    verificationObject: getVerificationObjectBulk(),
    revocationList: getRevocationListBulk()
  };
}

function getPublicKeyBulk() {
  if (!issuer.publicKey || !issuer.privateKey) return null;
  return {
    id: publicKeyJsonUrl,
    type: 'CryptographicKey',
    owner: issuerJsonUrl,
    publicKeyPem: issuer.publicKey
  };
}

function getRevocationListBulk() {
  // TODO: add revokedAssertions property
  return {
    type: 'RevocationList',
    issuer: issuerJsonUrl
  };
}

function getVerificationObjectBulk() {
  if (!issuer.publicKey || !issuer.privateKey) {
    return { type: 'HostedBadge' };
  }
  return {
    type: 'SignedBadge',
    creator: publicKeyJsonUrl
  };
}

module.exports = {
  getBulk,
  getPublicKeyBulk,
  getRevocationListBulk,
  getVerificationObjectBulk
};
