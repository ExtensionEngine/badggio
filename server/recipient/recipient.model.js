'use strict';

const crypto = require('crypto');
const { Model } = require('sequelize');

class Recipient extends Model {
  static fields(DataTypes) {
    return {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { isEmail: true, notEmpty: true },
        unique: { msg: 'This email address is already in use.' }
      },
      hashed: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      salt: {
        type: DataTypes.CHAR(64),
        unique: true,
        validate: {
          saltsOnlyHashed() {
            if (!this.hashed) throw new Error('Cannot salt non-hashed recipient.');
          }
        }
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
        return recipient.generateSalt();
      },
      beforeUpdate(recipient) {
        if (!recipient.changed('salt')) return recipient;
        return recipient.generateSalt();
      },
      beforeBulkCreate(recipients) {
        return recipients.map(recipient => recipient.generateSalt());
      }
    };
  }

  generateSalt() {
    this.salt = this.salt ? crypto.randomBytes(32).toString('hex') : null;
    return this;
  }
}

module.exports = Recipient;
