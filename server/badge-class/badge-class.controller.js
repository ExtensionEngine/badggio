'use strict';

const { createError } = require('../common/errors');
const { BadgeClass, sequelize } = require('../common/database');
const hasha = require('hasha');
const HttpStatus = require('http-status');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageHash', 'imageAuthorIri', 'tags'];

function create({ body }, res) {
  return sequelize.transaction(transaction => {
    return BadgeClass.create({ ...pick(body, inputAttrs) }, transaction)
      .then(badge => badge.storeImage(body.image, body.imageHash));
  }).then(badge => res.jsend.success(badge));
}

// TODO: finish this when we have created some badges
function list({ query: { email, emailLike, role } }, res) {
  return BadgeClass.findAll()
    .then(badges => res.jsend.success(badges));
}

function patch({ params, body }, res) {
  return sequelize.transaction(transaction => {
    return BadgeClass.findById(params.id, { paranoid: false })
      .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
      .then(badge => badge.update({ ...pick(body, inputAttrs) }, transaction))
      .then(badge => badge.storeImage(body.image, body.imageHash));
  }).then(badge => res.jsend.success(badge));
}

function addImageHash({ body }, res, next) {
  body.imageHash = hasha(body.image);
  return next();
}

module.exports = {
  create,
  addImageHash,
  list,
  patch
};
