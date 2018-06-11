'use strict';

const Ajv = require('ajv');
const fs = require('fs');

function validate(path) {
  if (fs.existsSync(path)) return true;

  validate.errors = [{
    keyword: 'path',
    message: `File at path "${path}" should exist!`
  }];
  return false;
}

const ajv = new Ajv();
ajv.addKeyword('path', {
  type: 'string',
  errors: true,
  schema: false,
  validate: validate
});

module.exports = ajv;
