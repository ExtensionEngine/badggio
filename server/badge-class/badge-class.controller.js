'use strict';

const { createError } = require('../common/errors');
const { BadgeClass, sequelize } = require('../common/database');
const hasha = require('hasha');
const HttpStatus = require('http-status');
const forEach = require('lodash/forEach');
const map = require('lodash/map');
const pick = require('lodash/pick');
const pickBy = require('lodash/pickBy');

const { NOT_FOUND } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageAuthorIri', 'tags'];

function create(req, res) {
  const { body, decodedImage } = req;
  const { imageHash } = decodedImage;
  return sequelize.transaction(transaction => {
    return BadgeClass.create({ ...pick(body, inputAttrs), imageHash }, transaction)
      .then(badge => badge.storeImage(decodedImage));
  }).then(badge => res.jsend.success(badge));
}

function list(req, _, next) {
  return BadgeClass.findAll().then(badges => {
    forEach(badges, badge => { badge.dataValues = pickBy(badge.dataValues); });
    req.locals = { badges };
    next();
  });
}

function patch(req, res) {
  const { body, decodedImage, params } = req;
  const { imageHash } = decodedImage;
  return sequelize.transaction(transaction => {
    return BadgeClass.findById(params.id, { paranoid: false })
      .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
      .then(badge => badge.update({ ...pick(body, inputAttrs), imageHash }, transaction))
      .then(badge => badge.storeImage(decodedImage, badge.imageHash));
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

function decodeImage(req, res, next) {
  const { body } = req;
  const extension = body.image.split(';')[0].split('/')[1];
  const base64data = body.image.split(',')[1];
  const imageHash = hasha(base64data + extension);
  req.decodedImage = { base64data, extension, imageHash };
  return next();
}

function encodeImage({ locals: { badges } }, res) {
  if (!Array.isArray(badges)) badges = [badges];
  return Promise.all(map(badges, badge => badge.getImage()))
    .then(() => res.jsend.success(badges));
}

module.exports = {
  create,
  decodeImage,
  encodeImage,
  list,
  patch
};
