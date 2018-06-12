'use strict';

const { Model } = require('sequelize');

class BadgeClass extends Model {
  static fields(DataTypes) {
    const { ARRAY, STRING, TEXT } = DataTypes;
    return {
      name: {
        type: STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 50] }
      },
      description: {
        type: TEXT,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 2000] }
      },
      criteriaNarrative: {
        type: TEXT,
        allowNull: false,
        validate: { notEmpty: true, len: [2, 2000] }
      },
      imageHash: {
        type: STRING,
        allowNull: false
      },
      imageCaption: {
        type: STRING,
        validate: { notEmpty: true, len: [2, 255] }
      },
      imageAuthorIri: {
        type: STRING,
        validate: { notEmpty: true, len: [2, 255] }
      },
      tags: {
        type: ARRAY(STRING),
        defaultValue: []
      },
      createdAt: {
        type: DataTypes.DATE,
        field: 'created_at'
      },
      deletedAt: {
        type: DataTypes.DATE,
        field: 'deleted_at'
      },
      updatedAt: {
        type: DataTypes.DATE,
        field: 'updated_at'
      }
    };
  }

  static options() {
    return {
      modelName: 'badge_class',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }
}

module.exports = BadgeClass;
