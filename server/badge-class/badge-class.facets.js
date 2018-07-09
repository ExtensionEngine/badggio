'use strict';

const paths = require('./badge-class.paths');
const pickBy = require('lodash/pickBy');
const { base: facetBase } = require('../common/facets');
const { issuer } = require('../config');
const { SERVER_URL } = process.env;

const root = SERVER_URL + paths.root;

function badge(badge) {
  const { name, description, criteriaNarrative: criteria, imageCaption, imageAuthorIri, tags } = badge;

  return Object.assign(
    base(badge),
    { name, description, criteria, image: bakedImageIri(badge) },
    pickBy({ imageCaption, imageAuthorIri, tags })
  );
}

function bakedImageIri({ id }) {
  return `${root}/${id}${paths.bakedImage}`;
}

function id({ id, uuid }) {
  return issuer.publicKey ? `urn:uuid:${uuid}` : `${root}/${id}.json`;
}

function base(badge) {
  return Object.assign(facetBase(), { id: id(badge), type: 'BadgeClass' });
}

module.exports = {
  badge,
  bakedImageIri
};
