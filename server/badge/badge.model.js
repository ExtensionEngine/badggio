'use strict';

const { Model } = require('sequelize');

class BadgeClass extends Model {
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
      criteria_url: {
        type: STRING
      },
      criteria_narrative: {
        type: TEXT
      },
      image_caption: {
        type: STRING
      },
      image_author_iri: {
        type: TEXT
      },
      image_hash: {
        type: STRING,
        allowNull: false
      },
      tags: {
        type: ARRAY(STRING)
      }
    };
  }

  static options() {
    return {
      modelName: 'BadgeClass',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = BadgeClass;
