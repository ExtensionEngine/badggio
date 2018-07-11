'use strict';

const paths = require('./badge-class.paths');
const { SERVER_URL } = process.env;

const root = SERVER_URL + paths.root;

function criteria({ id, criteriaNarrative }) {
  return {
    type: 'ImageObject',
    id: `${root}/${id}${paths.criteria}`,
    narrative: criteriaNarrative
  };
}

module.exports = { criteria };
