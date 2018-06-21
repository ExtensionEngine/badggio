'use strict';

const { Model } = require('sequelize');
const config = require('../config');
const createStorage = require('../common/storage');
const hasha = require('hasha');
const store = createStorage(config.storage);

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
        field: 'criteria_narrative',
        validate: { notEmpty: true, len: [2, 2000] }
      },
      imageHash: {
        type: STRING,
        field: 'image_hash',
        allowNull: false
      },
      imageCaption: {
        type: STRING,
        field: 'image_caption',
        validate: { notEmpty: true, len: [2, 255] }
      },
      imageAuthorIri: {
        type: STRING,
        field: 'image_author_iri',
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
      modelName: 'BadgeClass',
      tableName: 'badge_class',
      underscored: true,
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  storeImage(imageObj, currentHash) {
    const imageType = imageObj.split(';')[0].split('/')[1];
    const image = imageObj.split(',')[1];
    const key = `${this.id}.${imageType}`;
    const item = { key, image };
    return store.fileExists(key).then(() => {
      return store.getItem(key)
        .then(oldImage => hasha(oldImage) !== currentHash && store.setItem(item));
    }).catch(() => store.setItem(item)).then(() => this);
  }
}

module.exports = BadgeClass;
