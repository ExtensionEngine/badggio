'use strict';

const paths = require('./assertion.paths');
const pickBy = require('lodash/pickBy');
const { base: facetBase, verificationObject } = require('../common/facets');
const { identityObject } = require('../recipient/recipient.facets');
const { issuer } = require('../config');
const { SERVER_URL } = process.env;

const root = SERVER_URL + paths.root;

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
      image: bakedImageIri(assertion),
      issuedOn
    },
    pickBy({
      evidence: evidenceIri(assertion),
      narrative,
      expires
    }));
}

// TODO: use badgeClass facets once created
function badgeClassIri({ id }) {
  return `${SERVER_URL}/badges/${id}.json`;
}

function bakedImageIri({ id }) {
  return `${root}/${id}${paths.bakedImage}`;
}

function evidenceIri({ id, evidence }) {
  if (evidence && !evidence.length) return null;
  return `${root}/${id}${paths.evidence}`;
}

function revocationListIri() {
  if (!issuer.publicKey) return null;
  return `${root}${paths.revocationList}`;
}

function id({ id, uuid }) {
  if (issuer.publicKey) return `urn:uuid:${uuid}`;
  return `${root}/${id}.json`;
}

function base(assertion) {
  return Object.assign(facetBase(), {
    id: id(assertion),
    type: 'Assertion'
  });
}

module.exports = {
  assertion,
  bakedImageIri,
  evidenceIri,
  revocationListIri
};
