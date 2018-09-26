'use strict';

const { auth: config = {} } = require('../config');
const { Model } = require('sequelize');
const { role } = require('../../common/config');
const bcrypt = require('bcrypt');
const hasha = require('hasha');
const jwt = require('jsonwebtoken');
const logger = require('../common/logger')();
const mail = require('../common/mail');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const values = require('lodash/values');

const { INTEGRATION } = role;

const timestamps = ({ DATE }) => ({
  createdAt: {
    type: DATE,
    field: 'created_at'
  },
  updatedAt: {
    type: DATE,
    field: 'updated_at'
  },
  deletedAt: {
    type: DATE,
    field: 'deleted_at'
  }
});

const options = {
  modelName: 'user',
  timestamps: true,
  paranoid: true,
  freezeTableName: true
};

class Integration extends Model {
  constructor(values = {}, options = {}) {
    super({ ...values, role: INTEGRATION }, options);
  }

  static fields(DataTypes) {
    return {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true, notEmpty: true },
        unique: { msg: 'This integration already exists.' }
      },
      name: {
        type: DataTypes.STRING,
        field: 'first_name',
        set(name) {
          this.setDataValue('name', name);
          this.setDataValue('email', `${encrypt(name, 14)}_integration@localhost.com`);
        },
        validate: { notEmpty: true }
      },
      role: {
        type: DataTypes.ENUM(INTEGRATION),
        allowNull: false,
        defaultValue: INTEGRATION
      },
      token: {
        type: DataTypes.VIRTUAL,
        get() {
          const payload = pick(this, ['id', 'name']);
          return jwt.sign(payload, config.secret);
        }
      },
      ...timestamps(DataTypes)
    };
  }

  static options() { return options; }

  get isIntegration() {
    return true;
  }

  static get role() {
    return INTEGRATION;
  }

  static isIntegration(model) {
    return model.role === this.role;
  }
}

class User extends Model {
  constructor(...args) {
    super(...args);
    if (Integration.isIntegration(this)) return new Integration(...args);
  }

  static fields(DataTypes) {
    return {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true, notEmpty: true }
      },
      password: {
        type: DataTypes.STRING,
        validate: { notEmpty: true, len: [5, 255] }
      },
      role: {
        type: DataTypes.ENUM(values(role)),
        allowNull: false
      },
      token: {
        type: DataTypes.STRING,
        validate: { notEmpty: true, len: [10, 500] }
      },
      firstName: {
        type: DataTypes.STRING,
        field: 'first_name'
      },
      lastName: {
        type: DataTypes.STRING,
        field: 'last_name'
      },
      profile: {
        type: DataTypes.VIRTUAL,
        get() {
          return pick(this, ['id', 'firstName', 'lastName', 'email', 'role']);
        }
      },
      ...timestamps(DataTypes)
    };
  }

  static options() { return options; }

  static hooks() {
    return {
      beforeCreate(user) {
        return user.encryptPassword();
      },
      beforeUpdate(user) {
        return user.changed('password')
          ? user.encryptPassword()
          : Promise.resolve(user);
      },
      beforeBulkCreate(users) {
        return Promise.map(users, user => user.encryptPassword());
      }
    };
  }

  static async invite(userData, options) {
    const user = await this.create(userData);
    user.token = user.createToken({ expiresIn: '5 days' });
    mail.invite(user, options).catch(err =>
      logger.error('Error: Sending invite email failed:', err.message));
    return user.save();
  }

  async encryptPassword() {
    if (!this.password) return;
    this.password = await bcrypt.hash(this.password, config.saltRounds);
    return this;
  }

  async authenticate(password) {
    const result = await bcrypt.compare(password, this.password);
    return result && this;
  }

  sendResetToken(options) {
    this.token = this.createToken({ expiresIn: '5 days' });
    mail.resetPassword(this, options).catch(err =>
      logger.error('Error: Sending reset password email failed:', err.message));
    return this.save();
  }

  createToken(options = {}) {
    const payload = pick(this, ['id', 'email']);
    return jwt.sign(payload, config.secret, options);
  }
}

Object.assign(User, { Integration });

module.exports = User;

function encrypt(value, length) {
  const hash = hasha(value, { algorithm: 'sha1' });
  return hash.substring(hash.length - length);
}
