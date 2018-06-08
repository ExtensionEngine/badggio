'use strict';

const fs = require('fs');
const issuer = require('../../.issuer-rc.json');
const { isEmail, isURL } = require('validator');

function checkFilePresence(path) {
  if (!fs.existsSync(path)) {
    throw Error(`File at "${path}" cannot be found!`);
  }
}

function isString(str) {
  return typeof str === 'string';
}

if (!issuer.name || !isString(issuer.name)) {
  throw Error('Name is required and must be a string!');
}
if (!isURL(issuer.url)) throw Error('Url is not in valid format!');
if (!isEmail(issuer.email)) throw Error('Email is not in valid format!');
if (!isString(issuer.description)) throw Error('Description must be a string!');
if (!isString(issuer.telephone)) throw Error('Telephone must be a string!');
if (issuer.imagePath) checkFilePresence(issuer.imagePath);
if (issuer.publicKey) checkFilePresence(issuer.publicKey);
if (issuer.privateKey) checkFilePresence(issuer.privateKey);

module.exports = issuer;
