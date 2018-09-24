'use strict';

const { auth: config = {} } = require('../config');
const { Model } = require('sequelize');
const { role } = require('../../common/config');
const bcrypt = require('bcrypt');
const isEmail = require('is-email-like');
const jwt = require('jsonwebtoken');
const logger = require('../common/logger')();
const mail = require('../common/mail');
const pick = require('lodash/pick');
const Promise = require('bluebird');
const values = require('lodash/values');

const { INTEGRATION } = role;

class User extends Model {
  static fields(DataTypes) {
    return {
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail(username) {
            if (this.role === INTEGRATION || isEmail(username)) return;
            throw Error('Username should be an email.');
          }
        },
        unique: { msg: 'This username is already in use.' }
      },
      password: {
        type: DataTypes.STRING,
        validate: { notEmpty: true, len: [5, 255] }
      },
      role: {
        type: DataTypes.ENUM(values(role)),
        allowNull: false,
        defaultValue: role.STUDENT
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
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      },
      email: {
        type: DataTypes.VIRTUAL(DataTypes.STRING, ['username']),
        get() {
          return this.username;
        }
      },
      profile: {
        type: DataTypes.VIRTUAL,
        get() {
          return pick(this, ['id', 'firstName', 'lastName', 'email', 'role']);
        }
      }
    };
  }

  static options() {
    return {
      modelName: 'user',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static hooks() {
    return {
      beforeCreate(user) {
        if (user.role === INTEGRATION) user.token = user.createToken();
        return user.encryptPassword();
      },
      beforeUpdate(user) {
        if (user.role === INTEGRATION) user.token = user.createToken();
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
    const payload = pick(this, ['id', 'username']);
    return jwt.sign(payload, config.secret, options);
  }
}

module.exports = User;
