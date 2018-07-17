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
      criteria: criteriaIri(badge),
      tags,
      issuer
    }
  )
  );
}

function criteriaIri({ id, criteriaNarrative }) {
  return `${rootUrl}/${id}${paths.criteria}.json`;
}

function criteria({ id, criteriaNarrative }) {
  return {
    id: `${rootUrl}/${id}${paths.criteria}.html`,
    narrative: criteriaNarrative
  };
}

function imageIri({ id, imageCaption, imageAuthorIri }) {
  return `${rootUrl}/${id}${paths.image}.json`;
}

function image({ id, imageCaption, imageAuthorIri }) {
  return pickBy({
    type: 'ImageObject',
    id: `${rootUrl}/${id}${paths.image}`,
    imageCaption,
    imageAuthorIri
  });
}

function badgeClassIri({ id, uuid }) {
  return publicKey ? `urn:uuid:${uuid}` : `${rootUrl}/${id}.json`;
}

function base(badge) {
  return Object.assign(facetBase(), { id: badgeClassIri(badge), type: 'BadgeClass' });
}

module.exports = {
  badge,
  criteria,
  criteriaIri,
  image,
  imageIri,
  badgeClassIri
};
