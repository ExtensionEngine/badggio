'use strict';

const HttpStatus = require('http-status');
const map = require('lodash/map');
const { createError } = require('../common/errors');
const { NOT_FOUND } = HttpStatus;
const { Recipient, Sequelize } = require('../common/database');

const { EmptyResultError } = Sequelize;

function list(req, res) {
  return Recipient.findAll()
    .then(recipients => map(recipients, 'profile'))
    .then(recipients => res.jsend.success(recipients));
}

function create({ body: { email } }, res) {
  return Recipient.create({ email })
    .then(recipient => res.jsend.success(recipient.profile));
}

function patch({ body: { email }, params: { id } }, res) {
  return Recipient.findById(id, { paranoid: false, rejectOnEmpty: true })
    .catch(EmptyResultError, () => createError(NOT_FOUND, 'Recipient does not exist!'))
    .then(recipient => recipient.update({ email }))
    .then(recipient => res.jsend.success(recipient.profile));
}

module.exports = {
  create,
  list,
  patch
};
