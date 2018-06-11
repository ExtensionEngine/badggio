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
      const hash = hashImage(body);
      return BadgeClass.create({ ...pick(body, inputAttrs), imageHash: hash });
    }).then(badge => {
      return storeImageTo(storage, badge, body).then(() => badge);
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
      const hash = hashImage(body);
      if (hash === badge.imageHash) return { badge, newValues };
      newValues.imageHash = hash;
      return storeImageTo(storage, badge, body).then(() => ({ badge, newValues }));
    })
    .then(({ badge, newValues }) => badge.update(newValues))
    .then(badge => res.jsend.success(badge.profile));
}

module.exports = {
  create,
  list,
  patch
};

function storeImageTo(storage, { id }, { imageType, image }) {
  return storage.setItem({ key: composeKey(id, imageType), image });
}

function composeKey(id, imageType) { return `${id}.${imageType}`; }

function hashImage({ image }) { return hasha(image); }
