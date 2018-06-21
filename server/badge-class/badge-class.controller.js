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
      .then(badge => badge.storeImage(body));
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
      .then(badge => badge.storeImage(body));
  }).then(badge => res.jsend.success(badge));
}

/**
 * Extracts information from image string and appends them to body.
 * @middleware
 * @param {string} body - Contains image string.
 * @const {string} extension - Extension of parsed image.
 * @const {string} base64data - Data of image source in base64 format.
 * @const {string} imageHash - Hashed base64 data.
 */

function decodeImage({ body }, res, next) {
  const extension = body.image.split(';')[0].split('/')[1];
  const base64data = body.image.split(',')[1];
  const imageHash = hasha(base64data);
  Object.assign(body, { base64data, extension, imageHash });
  return next();
}

module.exports = {
  create,
  decodeImage,
  list,
  patch
};
