'use strict';

const { createError } = require('../common/errors');
const { BadgeClass } = require('../common/database');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageAuthorId', 'tags'];

function create({ body }, res) {
  return BadgeClass.findOne({ where: { name: body.name } })
    .then(badge => !badge || createError(NOT_FOUND, 'Badge already exists!'))
    .then(() => {
      // TODO: hash image and save hash with associated badge
      return BadgeClass.create({ ...pick(body, inputAttrs), imageHash });
    }).then(badge => {
      // TODO: store image to storage as { key: badge.id, image: body.image}
      // TODO: add profile getter to badge model
      return respond(res, badge.profile);
    });
}

function list({ query: { email, emailLike, role } }, res) {
  return BadgeClass.findAll().then(badges => respond(res, map(badges, 'profile')));
}

function patch({ params, body }, res) {
  return BadgeClass.findById(params.id, { paranoid: false })
    .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
    .then(badge => {
      const newValues = { ...pick(body, inputAttrs) };
      // TODO: if (body.image) hash image and add to newValues, update storage
      return badge.update(newValues);
    }).then(badge => respond(res, badge.profile));
}

module.exports = {
  create,
  list,
  patch
};

function respond(res, data = {}) { return res.jsend.success(data); }

function hash(data) { return };

function store(data) { return };
