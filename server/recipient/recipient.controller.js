'use strict';

const HttpStatus = require('http-status');
const pick = require('lodash/pick');
const { createError } = require('../common/errors');
const { NOT_FOUND } = HttpStatus;
const { Recipient } = require('../common/database');

const outputAttrs = ['id', 'email'];

function list(req, res) {
  return Recipient.findAll()
    .then(recipients => recipients.map(recipient => pick(recipient, outputAttrs)))
    .then(recipients => res.jsend.success(recipients));
}

function create({ body: { email } }, res) {
  return Recipient.create({ email })
    .then(recipient => res.jsend.success(pick(recipient, outputAttrs)));
}

function patch({ body: { email }, params: { id } }, res) {
  return Recipient.findById(id, { paranoid: false })
    .then(recipient => recipient || createError(NOT_FOUND, 'Recipient does not exist!'))
    .then(recipient => recipient.update({ email }))
    .then(recipient => res.jsend.success(pick(recipient, outputAttrs)));
}

module.exports = {
  list,
  create,
  patch
};
