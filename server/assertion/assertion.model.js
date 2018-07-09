'use strict';

const pick = require('lodash/pick');
const { Model } = require('sequelize');

class Assertion extends Model {
  static fields(DataTypes) {
    const { BOOLEAN, DATE, STRING, TEXT, UUID, UUIDV4, VIRTUAL } = DataTypes;
    return {
      uuid: {
        type: UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        unique: true
      },
      narrative: {
        type: TEXT
      },
      expires: {
        type: DATE
      },
      revoked: {
        type: BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      revocationReason: {
        type: STRING,
        field: 'revocation_reason',
        validate: {
          isRevoked() {
            if (!this.revoked) {
              throw new Error('Cannot set reason for non-revoked assertion.');
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
      profile: {
        type: VIRTUAL,
        get() {
          return Object.assign(
            pick(this, ['id', 'uuid', 'narrative', 'expires', 'revoked',
              'revocationReason', 'badgeClassId', 'recipientId']),
            { issuedOn: this.createdAt }
          );
        }
      }
    };
  }

  static options() {
    return {
      modelName: 'assertion',
      timestamps: true,
      freezeTableName: true
    };
  }

  static scopes({ Op, fn }) {
    const nullOrInTheFuture = { [Op.or]: { [Op.eq]: null, [Op.gt]: fn('NOW') } };
    return {
      active: { where: { revoked: false, expires: nullOrInTheFuture } },
      revoked: { where: { revoked: true } }
    };
  }

  static associate({ Recipient, BadgeClass }) {
    this.belongsTo(Recipient, {
      foreignKey: { name: 'recipientId', field: 'recipient_id' }
    });
    this.belongsTo(BadgeClass, {
      foreignKey: { name: 'badgeClassId', field: 'badge_class_id' },
      as: 'badgeClass'
    });
  }
}

module.exports = Assertion;
