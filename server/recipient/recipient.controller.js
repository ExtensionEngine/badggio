'use strict';

const HttpStatus = require('http-status');
const pick = require('lodash/pick');
const { createError } = require('../common/errors');
const { NOT_FOUND } = HttpStatus;
const { Recipient } = require('../common/database');

const inputAttrs = ['email', 'hashed', 'salted'];
const outputAttrs = ['id', ...inputAttrs];

function list(req, res) {
  return Recipient.findAll()
    .then(recipients => recipients.map(recipient => pick(recipient, outputAttrs)))
    .then(recipients => res.jsend.success(recipients));
}

function create({ body }, res) {
  return Recipient.create(pick(body, outputAttrs))
    .then(recipient => res.jsend.success(recipient));
}

function patch({ body, params }, res) {
  return Recipient.findById(params.id, { paranoid: false })
    .then(recipient => recipient || createError(NOT_FOUND, 'Recipient does not exist!'))
    .then(recipient => recipient.update(pick(body, inputAttrs)))
    .then(recipient => res.jsend.success(recipient));
}

module.exports = {
  list,
  create,
  patch
};
