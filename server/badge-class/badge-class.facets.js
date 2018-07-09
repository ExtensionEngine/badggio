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
    { name, description, image: imageIri(badge) },
    { criteria: criteriaClass(badge) },
    pickBy({ imageCaption, imageAuthorIri, tags }),
    { issuer: issuer.issuerUrl }
  );
}

function imageIri({ id }) {
  return `${root}/${id}${paths.image}`;
}

function criteriaClass({ id, criteriaNarrative }) {
  return {
    id: `${root}/${id}${paths.criteria}`,
    narrative: criteriaNarrative
  };
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
