'use strict';

const crypto = require('crypto');
const { Model } = require('sequelize');

class Recipient extends Model {
  static fields(DataTypes) {
    const { BOOLEAN, CHAR, DATE, STRING, VIRTUAL } = DataTypes;
    return {
      email: {
        type: STRING,
        allowNull: false,
        validate: { isEmail: true, notEmpty: true },
        unique: { msg: 'This email address is already in use.' }
      },
      hashed: {
        type: BOOLEAN,
        allowNull: false
      },
      salt: {
        type: CHAR(64),
        unique: true
      },
      salted: {
        type: VIRTUAL(BOOLEAN, ['salt']),
        allowNull: false,
        get() {
          return this.getDataValue('salt') !== null;
        },
        set(salted) {
          if (salted && this.getDataValue('salt')) return;
          this.setDataValue('salted', salted);
          const salt = salted ? crypto.randomBytes(32).toString('hex') : null;
          this.setDataValue('salt', salt);
        },
        validate: {
          isHashed() {
            if (this.salted && !this.hashed) {
              throw new Error('Cannot salt non-hashed recipient.');
            }
          }
        }
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
}

module.exports = Recipient;
