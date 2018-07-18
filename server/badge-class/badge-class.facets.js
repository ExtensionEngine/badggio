'use strict';

const paths = require('./badge-class.paths');
const pickBy = require('lodash/pickBy');
const { base: facetBase } = require('../common/facets');
const { issuer: { publicKey } } = require('../config');
const { profile: issuer } = require('../issuer/issuer.facets');
const { SERVER_URL } = process.env;

const rootUrl = SERVER_URL + paths.root;

function badge(badge) {
  const { name, description, tags } = badge;

  return pickBy(Object.assign(
    base(badge),
    {
      name,
      description,
      image: imageIri(badge),
      criteria: criteria(badge),
      tags,
      issuer
    }
  )
  );
}

function criteria({ id, criteriaNarrative }) {
  return {
    id: `${rootUrl}/${id}${paths.criteria}`,
    narrative: criteriaNarrative
  };
}

function humanCriteria({ criteriaNarrative }) {
  // TODO: return criteriaNarrative embedded in a html file
}

function imageIri({ id }) {
  return `${rootUrl}/${id}${paths.image}`;
}

function image({ id }) {
  // TODO: return image embedded in a html file
}

function badgeClassIri({ id, uuid }) {
  return publicKey ? `urn:uuid:${uuid}` : `${rootUrl}/${id}.json`;
}

function base(badge) {
  return Object.assign(facetBase(), { id: badgeClassIri(badge), type: 'BadgeClass' });
}

module.exports = {
  badge,
  humanCriteria,
  image,
  badgeClassIri
};
