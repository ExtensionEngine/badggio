'use strict';

const { createError } = require('../common/errors');
const {
  badge: badgeFacet,
  humanCriteria: criteriaFacet,
  imageIri: imageFacet
} = require('./badge-class.facets');
const { BadgeClass, sequelize } = require('../common/database');
const hasha = require('hasha');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageAuthorIri', 'tags'];

function loadBadge(req, res, next) {
  return BadgeClass.findById(req.params.id, { paranoid: false })
    .then(badge => {
      res.locals.badge = badge;
      return badge ? next() : next(createError(NOT_FOUND, 'Badge does not exist!'));
    });
}

function create(req, res) {
  const { body } = req;
  const { decodedImage } = res.locals;
  const { hash: imageHash } = decodedImage;
  return sequelize.transaction(transaction => {
    return BadgeClass.create({ ...pick(body, inputAttrs), imageHash }, transaction)
      .then(badge => badge.storeImage(decodedImage));
  }).then(badge => res.jsend.success(badge));
}

function list(req, res, next) {
  return BadgeClass.findAll({ order: [['id']] }).then(badges => {
    res.locals.badges = badges;
    next();
  });
}

function patch(req, res) {
  const { body } = req;
  const { decodedImage, badge } = res.locals;
  const { hash: imageHash } = decodedImage;
  const newVals = { ...pick(body, inputAttrs), imageHash };
  return sequelize.transaction(transaction => {
    return badge.update(newVals, transaction)
    .then(badge => badge.storeImage(decodedImage, badge.previous(imageHash)));
  }).then(badge => res.jsend.success(badge));
}

function decodeImage(req, res, next) {
  res.locals.decodedImage = extractImageData(req.body.image);
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

function encodeImages(req, res) {
  const { badges } = res.locals;
  return Promise.all(map(badges, badge => badge.getImage()))
    .then(() => res.jsend.success(badges));
}

function badge(_, res) {
  return res.json(badgeFacet(res.locals.badge));
}

function criteria(_, res) {
  return res.render('criteria', criteriaFacet(res.locals.badge));
}

function image(_, res) {
  return imageFacet(res.locals.badge).then(renderData => res.render('image', renderData));
}

module.exports = {
  badge,
  create,
  criteria,
  decodeImage,
  encodeImages,
  image,
  list,
  loadBadge,
  patch
};
