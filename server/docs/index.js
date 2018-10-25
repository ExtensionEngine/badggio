'use strict';

const fs = require('fs');
const logger = require('../common/logger')();
const path = require('path');
const router = require('express').Router();
const swagger = require('swagger-ui-express');
const yaml = require('js-yaml');

const api = loadYaml('../../docs/api.yaml');

router.use(swagger.serve, swagger.setup(api));

module.exports = {
  path: '/docs',
  router
};

function loadYaml(filepath) {
  filepath = path.join(__dirname, filepath);
  try {
    return yaml.safeLoad(fs.readFileSync(filepath, 'utf8'));
  } catch (err) {
    logger.error(err, 'Error loading API documentation');
  }
}
