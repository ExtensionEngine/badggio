'use strict';

const { getValidator, setLogging } = require('../common/database/helpers');
const { Integration } = require('../common/database');
const { prompt } = require('inquirer');

setLogging(Integration, false);

const actions = {
  create,
  token: findOne,
  default: findOne
};
const action = actions[process.argv[2]] || actions.default;

const questions = [{
  type: 'input',
  name: 'name',
  message: 'Enter integration name:',
  validate: getValidator(Integration, 'name')
}];

prompt(questions)
  .then(data => console.log() || action(data))
  .then(integration => console.log(`Integration token: ${integration.token}`))
  .catch(err => console.error(err.message) || 1)
  .then((code = 0) => process.exit(code));

function create({ name }) {
  return Integration.create({ name })
    .then(integration => console.log(`Integration created: ${name}`) || integration);
}

function findOne({ name }) {
  return Integration.findOne({ where: { name } })
    .then(integration => {
      if (integration) return integration;
      return Promise.reject(new Error(`Integration "${name}" does not exist.`));
    });
}