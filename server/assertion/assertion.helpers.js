'use strict';

const bakery = require('../common/patched/openbadges-bakery');
const getStream = require('get-stream');
const jwt = require('jsonwebtoken');
const { assertion: assertionFacet, assertionIri } = require('./assertion.facets');
const { Base64: base64 } = require('js-base64');
const { issuer } = require('../config');

function bake(assertion) {
  return assertion.badgeClass.getImage()
    .then(({ image, extension }) => {
      const options = buildOptions(assertion, Buffer.from(image, 'base64'));

      return new Promise((resolve, reject) => {
        bakery.bake(options, (err, image) => {
          if (err) return reject(err);
          return resolve(encode(image, extension));
        });
      });
    });
}

function buildOptions(assertion, image) {
  if (issuer.publicKey) return { image, signature: sign(assertion) };
  return {
    image,
    assertion: assertionFacet(assertion),
    url: assertionIri(assertion)
  };
}

function encode(image, extension) {
  if (extension === 'svg+xml') {
    return { image: base64.encode(image), extension };
  }

  return getStream(image, { encoding: 'base64' })
    .then(image => ({ image, extension }));
}

function sign(assertion) {
  return jwt.sign(assertionFacet(assertion),
    issuer.privateKey,
    { algorithm: 'RS256', noTimestamp: true });
}

module.exports = { bake };
