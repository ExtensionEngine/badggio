'use strict';

const paths = require('./badge-class.paths');
const pickBy = require('lodash/pickBy');
const { base: facetBase } = require('../common/facets');
const { issuer } = require('../config');
const { SERVER_URL } = process.env;

const root = SERVER_URL + paths.root;

function badge(badge) {
  const { name, description, imageCaption, imageAuthorIri, tags } = badge;

  return Object.assign(
    base(badge),
    { name, description, criteria: criteriaIri(badge), image: imageIri(badge) },
    pickBy({ imageCaption, imageAuthorIri, tags }),
    { issuer: issuer.issuerUrl }
  );
}

function criteriaIri({ id, criteriaNarrative }) {
  return `${root}/${id}${paths.criteria}`;
}

function imageIri({ id }) {
  return `${root}/${id}${paths.image}`;
}

function badgeClassIri({ id }) {
  return `${root}/${id}.json`;
}

function base(badge) {
  return Object.assign(
    facetBase(),
    { id: badgeClassIri(badge), type: 'BadgeClass' }
  );
}

module.exports = {
  badge,
  badgeClassIri
};
