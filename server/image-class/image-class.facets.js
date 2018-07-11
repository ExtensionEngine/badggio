'use strict';

const pickBy = require('lodash/pickBy');
const paths = require('./badge-class.paths');
const { SERVER_URL } = process.env;

const root = SERVER_URL + paths.root;

function image({ id, imageCaption, imageAuthorIri }) {
  return pickBy({
    type: 'Criteria',
    id: `${root}/${id}${paths.image}`,
    imageCaption,
    imageAuthorIri
  });
}

module.exports = { image };
