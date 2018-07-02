'use strict';

const Ajv = require('ajv');
const fs = require('fs');

function fileExists(path) {
  if (fs.existsSync(path)) return true;

  fileExists.errors = [{
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
  validate: fileExists
});

module.exports = ajv;
