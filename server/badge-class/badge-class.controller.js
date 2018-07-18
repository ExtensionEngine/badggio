'use strict';

const { createError } = require('../common/errors');
const {
  badge: badgeFacet,
  humanCriteria: criteriaFacet,
  image: imageFacet
} = require('./badge-class.facets');
const { BadgeClass, sequelize } = require('../common/database');
const hasha = require('hasha');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageAuthorIri', 'tags'];

function findBadgeById({ id }) {
  return BadgeClass.findById(id, { paranoid: false })
      .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
}

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
  const newVals = { ...pick(body, inputAttrs), imageHash };
  return sequelize.transaction(transaction => {
    return findBadgeById(params.id)
      .then(badge => badge.update(newVals, transaction))
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
  return findBadgeById(id).then(badge => res.json(badgeFacet(badge)));
}

function criteria({ params: { id } }, res) {
  return findBadgeById(id).then(badge => res.json(criteriaFacet(badge)));
}

function image({ params: { id } }, res) {
  return findBadgeById(id).then(badge => res.json(imageFacet(badge)));
}

module.exports = {
  badge,
  create,
  criteria,
  decodeImage,
  encodeImages,
  image,
  list,
  patch
};
