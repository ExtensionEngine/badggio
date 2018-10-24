'use strict';

const router = require('express').Router();
const swagger = require('swagger-ui-express');
const yaml = require('yamljs');

const api = yaml.load('./docs/api.yaml');

router.use(swagger.serve, swagger.setup(api));

module.exports = {
  path: '/docs',
  router
};
