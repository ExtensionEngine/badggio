'use strict';

const { createError } = require('../common/errors');
const { BadgeClass, sequelize } = require('../common/database');
const createStorage = require('../common/storage');
const config = require('../config');
const hasha = require('hasha');
const HttpStatus = require('http-status');
const map = require('lodash/map');
const pick = require('lodash/pick');
const set = require('lodash/set');

const { NOT_FOUND, SERVICE_UNAVAILABLE } = HttpStatus;
const inputAttrs = ['name', 'description', 'criteriaNarrative', 'imageCaption',
  'imageAuthorId', 'tags'];
const storage = createStorage(config.storage);

function create({ body }, res) {
  return sequelize.transaction((t) => {
    const transaction = { transaction: t };
    const newBadge = { ...pick(body, inputAttrs) };

    return BadgeClass.findOne({ where: { name: body.name } })
      .then(badge => !badge || createError(NOT_FOUND, 'Badge already exists!'))
      .then(() => set(newBadge, 'imageHash', hasha(body.image)))
      .then(() => BadgeClass.create(newBadge, transaction))
      .then(badge => {
        const key = `${badge.id}.${body.imageType}`;
        return storage.setItem({ key }).then(() => badge);
      });
  }).then(badge => res.jsend.success(badge.profile))
    .catch(() => {
      const error = createError(SERVICE_UNAVAILABLE, 'Badge create failed!');
      return res.jsend.fail(error);
    });
}

// TODO: finish this when we have created some badges
function list({ query: { email, emailLike, role } }, res) {
  return BadgeClass.findAll()
    .then(badges => res.jsend.success(map(badges, 'profile')));
}

function patch({ params, body }, res) {
  return sequelize.transaction((t) => {
    const transaction = { transaction: t };
    const newValues = { ...pick(body, inputAttrs) };

    return BadgeClass.findById(params.id, { paranoid: false })
      .then(badge => badge || createError(NOT_FOUND, 'Badge does not exist!'))
      .then(badge => {
        set(newValues, 'imageHash', hasha(body.image));
        return badge.update(newValues, transaction);
      })
      .then(badge => {
        const key = `${badge.id}.${body.imageType}`;
        return !storage.fileExists(badge.imageHash)
          ? storage.setItem({ key }).then(() => badge)
          : badge;
      });
  }).then(badge => res.jsend.success(badge.profile))
  .catch(() => {
    const error = createError(SERVICE_UNAVAILABLE, 'Badge patch failed!');
    return res.jsend.fail(error);
  });
}

module.exports = {
  create,
  list,
  patch
};
