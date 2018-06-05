'use strict';

const { Model } = require('sequelize');

class Badge extends Model {
  static fields(DataTypes) {
    const { ARRAY, STRING, TEXT } = DataTypes;
    return {
      name: {
        type: STRING,
        allowNull: false
      },
      description: {
        type: TEXT,
        allowNull: false
      },
      criteriaUrl: {
        type: STRING
      },
      criteriaNarrative: {
        type: TEXT
      },
      imageCaption: {
        type: STRING
      },
      imageAuthorIri: {
        type: TEXT
      },
      imageHash: {
        type: STRING,
        allowNull: false
      },
      tags: {
        type: ARRAY(STRING)
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
      modelName: 'badge',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = Badge;
