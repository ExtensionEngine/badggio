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
      image: image(badge),
      criteria: criteria(badge),
      tags,
      issuer: issuer()
    }
  )
  );
}

function criteria({ id, criteriaNarrative }) {
  return {
    type: 'ImageObject',
    id: `${rootUrl}/${id}${paths.criteria}`,
    narrative: criteriaNarrative
  };
}

function image({ id, imageCaption, imageAuthorIri }) {
  return pickBy({
    type: 'Criteria',
    id: `${rootUrl}/${id}${paths.image}`,
    imageCaption,
    imageAuthorIri
  });
}

function badgeClassIri({ id }) {
  return `${rootUrl}/${id}.json`;
}

function base(badge) {
  return Object.assign(facetBase(), { id: id(badge), type: 'BadgeClass' });
}

function id({ id, uuid }) {
  return publicKey ? `urn:uuid:${uuid}` : `${rootUrl}/${id}.json`;
}

module.exports = {
  badge,
  criteria,
  image,
  badgeClassIri
};
