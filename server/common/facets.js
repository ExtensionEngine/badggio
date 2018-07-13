'use strict';

const { issuer } = require('../config');

function base() {
  return { '@context': 'https://w3id.org/openbadges/v2' };
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
  base,
  verificationObject
};
