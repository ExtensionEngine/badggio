'use strict';

const get = require('lodash/get');
const map = require('lodash/map');
const paths = require('./assertion.paths');
const pickBy = require('lodash/pickBy');
const { badgeClassIri } = require('../badge-class/badge-class.facets');
const { base: facetBase, verificationObject } = require('../common/facets');
const { identityObject } = require('../recipient/recipient.facets');
const { issuer } = require('../config');
const { revocationListIri } = require('../issuer/issuer.facets');
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

function assertionIri({ id }) {
  return `${rootUrl}/${id}.json`;
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

function base(assertion) {
  return Object.assign(facetBase(), {
    id: assertionIri(assertion),
    type: 'Assertion'
  });
}

function revoked(assertion) {
  if (!assertion.revocationReason) return assertionIri(assertion);
  return {
    id: assertionIri(assertion),
    revocationReason: assertion.revocationReason
  };
}

module.exports = {
  assertion,
  assertionIri,
  revocationList,
  imageIri,
  evidenceIri
};
