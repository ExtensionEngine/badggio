'use strict';

const { createError } = require('../common/errors');
const { badge: badgeFacet } = require('./badge-class.facets');
const { BadgeClass, sequelize } = require('../common/database');
const hasha = require('hasha');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageAuthorIri', 'tags'];

function create(req, res) {
  const { body, locals } = req;
  const { decodedImage } = locals;
  const { hash: imageHash } = decodedImage;
  return sequelize.transaction(transaction => {
    return BadgeClass.create({ ...pick(body, inputAttrs), imageHash }, transaction)
      .then(badge => badge.storeImage(decodedImage));
  }).then(badge => res.jsend.success(badge));
}

function list(req, _, next) {
  return BadgeClass.findAll({ order: [['id']] }).then(badges => {
    req.locals = { badges };
    next();
  });
}

function patch(req, res) {
  const { body, locals, params } = req;
  const { decodedImage } = locals;
  const { hash: imageHash } = decodedImage;
  return sequelize.transaction(transaction => {
    return BadgeClass.findById(params.id, { paranoid: false })
      .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
      .then(badge => badge.update({ ...pick(body, inputAttrs), imageHash }, transaction))
      .then(badge => badge.storeImage(decodedImage, badge.previous(imageHash)));
  }).then(badge => res.jsend.success(badge));
}

function decodeImage(req, res, next) {
  req.locals = { decodedImage: extractImageData(req.body.image) };
  return next();
}

/**
 * Transform client side image received as a concatenated String into more
 * suitable format required for backend data persistency.
 * @param {string} imageString - String with concatenated image information.
 * @returns {(Object)} - image as an object { base64data: base64-encoded image,
 * extension: image file extension, hash: hashed base64data }.
 */

function extractImageData(imageString) {
  const extension = imageString.split(';')[0].split('/')[1];
  const base64data = imageString.split(',')[1];
  const hash = hasha(base64data + extension);
  return { base64data, extension, hash };
}

function encodeImages({ locals: { badges } }, res) {
  return Promise.all(map(badges, badge => badge.getImage()))
    .then(() => res.jsend.success(badges));
}

function badge({ params: { id } }, res) {
  return BadgeClass.findById(id)
    .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
    .then(badge => res.json(badgeFacet(badge)));
}

module.exports = {
  badge,
  create,
  decodeImage,
  encodeImages,
  list,
  patch
};
