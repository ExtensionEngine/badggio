'use strict';

const { prompt } = require('inquirer');
const { role: { INTEGRATION } } = require('../../common/config');
const { User } = require('../common/database');
const inRange = require('lodash/inRange');
const set = require('lodash/set');

const noop = Function.prototype;
const notEmpty = input => input.length > 0;

// Disable Sequelize SQL logging.
set(User, 'sequelize.options.logging', noop);

const actions = {
  create: data => create(data),
  token: data => get(data)
};
const action = actions[process.argv[2]];

const questions = [{
  type: 'input',
  name: 'username',
  message: 'Enter integration name:',
  validate: getValidator(User, 'username')
}];

prompt(questions)
  .then(data => console.log() || action(data))
  .then(user => console.log(`Integration token: ${user.createToken()}`))
  .catch(err => console.error(err.message) || 1)
  .then((code = 0) => process.exit(code));

function create({ username }) {
  return User.create({ username, role: INTEGRATION })
    .then(user => console.log(`Integration created: ${user.username}`) || user);
}

function get({ username }) {
  return User.findOne({ where: { username, role: INTEGRATION } })
    .then(user => user || Promise.reject(Error(`Integration "${username}" does not exist.`)));
}

function getValidator(Model, attribute) {
  return function validate(input) {
    const validator = Model.prototype.validators[attribute];
    if (!validator || !validator.len) {
      return notEmpty(input) || `"${attribute}" can not be empty`;
    }
    const [min, max] = validator.len;
    return inRange(input.length, min, max) ||
      `"${attribute}" must be between ${min} and ${max} characters long`;
  };
}
