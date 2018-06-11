'use strict';

const { createError } = require('../common/errors');
const { BadgeClass } = require('../common/database');
const createStorage = require('../common/storage');
const config = require('../config');
const hasha = require('hasha');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');

const { NOT_FOUND } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageAuthorId', 'tags'];
const storage = createStorage(config.storage);

function create({ body }, res) {
  return BadgeClass.findOne({ where: { name: body.name } })
    .then(badge => !badge || createError(NOT_FOUND, 'Badge already exists!'))
    .then(() => {
      const imageHash = hasha(body);
      return BadgeClass.create({ ...pick(body, inputAttrs), imageHash });
    }).then(badge => {
      return storage.setItem({ key: `${badge.id}.${body.imageType}` })
        .then(() => badge);
    }).then(badge => res.jsend.success(badge.profile));
}

function list({ query: { email, emailLike, role } }, res) {
  return BadgeClass.findAll()
    .then(badges => res.jsend.success(map(badges, 'profile')));
}

function patch({ params, body }, res) {
  return BadgeClass.findById(params.id, { paranoid: false })
    .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
    .then(badge => {
      const newValues = { ...pick(body, inputAttrs) };
      const imageHash = hasha(body);
      if (imageHash === badge.imageHash) return { badge, newValues };
      newValues.imageHash = imageHash;
      return storage.setItem({ key: `${badge.id}.${body.imageType}` })
        .then(() => ({ badge, newValues }));
    })
    .then(({ badge, newValues }) => badge.update(newValues))
    .then(badge => res.jsend.success(badge.profile));
}

module.exports = {
  create,
  list,
  patch
};
