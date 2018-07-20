'use strict';

const paths = require('./badge-class.paths');
const pickBy = require('lodash/pickBy');
const { base: facetBase } = require('../common/facets');
const { issuer: { publicKey } } = require('../config');
const { profile } = require('../issuer/issuer.facets');
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
      issuer: profile()
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

function humanCriteria({ name, criteriaNarrative }) {
  return { criteria: criteriaNarrative };
}

function image({ id, imageCaption, imageAuthorIri }) {
  return pickBy({
    id: `${rootUrl}/${id}${paths.image}`,
    caption: imageCaption,
    author: imageAuthorIri
  });
}

function imageIri(badge) {
  return badge.getImage().then(({ dataValues }) => ({ image: dataValues.image }));
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
  imageIri,
  badgeClassIri
};
