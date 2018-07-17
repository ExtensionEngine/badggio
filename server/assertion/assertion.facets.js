'use strict';

const bakery = require('../common/patched/openbadges-bakery');
const config = require('../config');
const createStorage = require('../common/storage');
const get = require('lodash/get');
const jwt = require('jsonwebtoken');
const map = require('lodash/map');
const paths = require('./assertion.paths');
const pickBy = require('lodash/pickBy');
const store = createStorage(config.storage);
const { badgeClassIri } = require('../badge-class/badge-class.facets');
const { base: facetBase, verificationObject } = require('../common/facets');
const { identityObject } = require('../recipient/recipient.facets');
const { issuer } = require('../config');
const { SERVER_URL } = process.env;

const rootUrl = SERVER_URL + paths.root;

function assertion(assertion) {
  const { badgeClass, recipient, issuedOn, narrative,
    expires, revoked, revocationReason } = assertion;

  if (revoked) {
    return Object.assign(base(assertion), pickBy({ revoked, revocationReason }));
  }

  return Object.assign(base(assertion),
    {
      recipient: identityObject(recipient),
      badge: badgeClassIri(badgeClass),
      verification: verificationObject(),
      image: imageIri(assertion),
      issuedOn
    },
    pickBy({
      evidence: evidenceIri(assertion),
      narrative,
      expires
    }));
}

function bake(_assertion, callback) {
  const key = _assertion.badgeClassId.toString();

  return store.getItem(key).then(({ image }) => {
    const options = { image: Buffer.from(image, 'base64') };

    if (issuer.publicKey) options.signature = sign(_assertion);
    else {
      options.assertion = assertion(_assertion);
      options.url = id(_assertion);
    }

    return bakery.bake(options, callback);
  });
}

function revocationList(assertions) {
  return Object.assign(
    facetBase(),
    {
      id: revocationListIri(),
      type: 'RevocationList',
      issuer: issuer.issuerUrl,
      revokedAssertions: map(assertions, revoked)
    }
  );
}

// TODO: implement this url so it returns assertion's "baked" image
function imageIri({ id }) {
  return `${rootUrl}/${id}${paths.image}`;
}

// TODO: implement this url so it returns assertion's evidence
function evidenceIri({ id, evidence }) {
  if (!get(evidence, 'length')) return null;
  return `${rootUrl}/${id}${paths.evidence}`;
}

function revocationListIri() {
  if (!issuer.publicKey) return null;
  return `${rootUrl}${paths.revocationList}`;
}

function id({ id, uuid }) {
  if (issuer.publicKey) return `urn:uuid:${uuid}`;
  return `${rootUrl}/${id}.json`;
}

function base(assertion) {
  return Object.assign(facetBase(), {
    id: id(assertion),
    type: 'Assertion'
  });
}

function revoked(assertion) {
  if (!assertion.revocationReason) return id(assertion);
  return {
    id: id(assertion),
    revocationReason: assertion.revocationReason
  };
}

function sign(_assertion) {
  return jwt.sign(assertion(_assertion),
    issuer.privateKey,
    { algorithm: 'RS256', noTimestamp: true });
}

module.exports = {
  assertion,
  bake,
  revocationList,
  imageIri,
  evidenceIri,
  revocationListIri
};
