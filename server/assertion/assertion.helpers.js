'use strict';

const bakery = require('../common/patched/openbadges-bakery');
const jwt = require('jsonwebtoken');
const { assertion: assertionFacet, id } = require('./assertion.facets');
const { issuer } = require('../config');

function bake(assertion, callback) {
  return assertion.badgeClass.getImage()
    .then(({ dataValues }) => {
      const { imageBase64 } = dataValues;
      const options = { image: Buffer.from(imageBase64, 'base64') };

      if (issuer.publicKey) {
        options.signature = sign(assertion);
      } else {
        options.assertion = assertionFacet(assertion);
        options.url = id(assertion);
      }

      return bakery.bake(options, callback);
    });
}

function sign(assertion) {
  return jwt.sign(assertionFacet(assertion),
    issuer.privateKey,
    { algorithm: 'RS256', noTimestamp: true });
}

module.exports = { bake };
