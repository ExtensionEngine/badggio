'use strict';

const fs = require('fs');
const logger = require('../common/logger')();
const path = require('path');
const Yaml = require('js-yaml');

const [api, yaml] = loadYaml('../../docs/api.yaml');
const template = (key, value) => `
window.globals = window.globals || {};
window.globals['${key}'] = ${JSON.stringify(value)}`.trim();

const responses = res => ({
  json: () => res.json(api),
  js: () => res.type('application/javascript').send(template('api', api)),
  yaml: () => res.type('text/yaml').send(yaml)
});

function docs({ params: { type } }, res) {
  return responses(res)[type]();
}

module.exports = { docs };

function loadYaml(filepath) {
  filepath = path.join(__dirname, filepath);
  try {
    const source = fs.readFileSync(filepath, 'utf8');
    const data = Yaml.safeLoad(source);
    return [data, source];
  } catch (err) {
    logger.error(err, 'Error loading API documentation');
  }
}
