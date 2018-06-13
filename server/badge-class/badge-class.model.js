'use strict';

const { Model } = require('sequelize');
const config = require('../config');
const createStorage = require('../common/storage');
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
      // TODO: ADD profile getter
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

  storeImage({ image, imageType }) {
    //  TODO: check image type
    const key = `${this.id}.${imageType}`;
    const isImageNew = !store.fileExists(key);

    if (isImageNew) return store.setItem({ key, image }).then(() => this);
    return store.getItem(key)
      .then(oldImage => oldImage !== image)
      .then(changed => changed && store.setItem({ key, image }))
      .then(() => this);
  }
}

module.exports = BadgeClass;
