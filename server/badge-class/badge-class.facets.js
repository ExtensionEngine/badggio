'use strict';

const paths = require('./badge-class.paths');
const pickBy = require('lodash/pickBy');
const { base: facetBase } = require('../common/facets');
const { criteria } = require('../criteria-class/criteria-class.facets');
const { image } = require('../image-class/image-class.facets');
const { issuer: { publicKey } } = require('../config');
const { profile: issuer } = require('../issuer/issuer.facets');
const { SERVER_URL } = process.env;

const root = SERVER_URL + paths.root;

function badge(badge) {
  const { name, description, tags } = badge;

  return pickBy(
    Object.assign(base(badge), { name, description, image, criteria, tags, issuer })
  );
}

function badgeClassIri({ id, uuid }) {
  return publicKey ? `urn:uuid:${uuid}` : `${root}/${id}.json`;
}

function base(badge) {
  return Object.assign(facetBase(), { id: badgeClassIri(badge), type: 'BadgeClass' });
}

module.exports = {
  badge,
  badgeClassIri
};
