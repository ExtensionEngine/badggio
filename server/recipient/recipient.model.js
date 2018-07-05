'use strict';

const crypto = require('crypto');
const hasha = require('hasha');
const pick = require('lodash/pick');
const { Model } = require('sequelize');
const { recipients: { hashed, salted } } = require('../config');

function sha256(value) {
  return 'sha256$' + hasha(value, { algorithm: 'sha256' });
}

class Recipient extends Model {
  static fields(DataTypes) {
    const { CHAR, DATE, STRING } = DataTypes;
    return {
      email: {
        type: STRING,
        allowNull: false,
        validate: { isEmail: true, notEmpty: true },
        unique: { msg: 'This email address is already in use.' }
      },
      hash: {
        type: CHAR(71),
        unique: true
      },
      salt: {
        type: CHAR(64),
        unique: true
      },
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
      },
      profile: {
        type: DataTypes.VIRTUAL,
        get() {
          return pick(this, ['id', 'email']);
        }
      }
    };
  }

  static options() {
    return {
      modelName: 'recipient',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  static hooks() {
    return {
      beforeCreate(recipient) {
        return recipient.hashRecipient();
      },
      beforeUpdate(recipient) {
        if (!recipient.changed('email')) return recipient;
        return recipient.hashRecipient();
      },
      beforeBulkCreate(recipients) {
        return recipients.map(recipient => recipient.hashRecipient());
      }
    };
  }

  hashRecipient() {
    if (!hashed) return this;
    if (!salted) {
      this.hash = sha256(this.email);
      return this;
    }
    this.salt = crypto.randomBytes(32).toString('hex');
    this.hash = sha256(this.email + this.salt);
    return this;
  }
}

module.exports = Recipient;
