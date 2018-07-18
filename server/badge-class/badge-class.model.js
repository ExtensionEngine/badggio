'use strict';

const { Model } = require('sequelize');
const config = require('../config');
const createStorage = require('../common/storage');
const store = createStorage(config.storage);

class BadgeClass extends Model {
  static fields(DataTypes) {
    const { ARRAY, DATE, STRING, TEXT, UUID, UUIDV4 } = DataTypes;
    return {
      uuid: {
        type: UUID,
        defaultValue: UUIDV4,
        allowNull: false,
        unique: true
      },
      name: {
        type: STRING,
        allowNull: false,
        validate: { notEmpty: true, len: [1, 255] }
      },
      description: {
        type: TEXT,
        allowNull: false,
        validate: { notEmpty: true, len: [1, 2000] }
      },
      criteriaNarrative: {
        type: TEXT,
        allowNull: false,
        field: 'criteria_narrative',
        validate: { notEmpty: true, len: [1, 2000] }
      },
      imageHash: {
        type: STRING,
        field: 'image_hash',
        allowNull: false
      },
      imageCaption: {
        type: STRING,
        field: 'image_caption',
        validate: { len: [0, 255] }
      },
      imageAuthorIri: {
        type: STRING,
        field: 'image_author_iri',
        validate: { len: [0, 255] }
      },
      tags: {
        type: ARRAY(STRING)
      },
      createdAt: {
        type: DATE,
        field: 'created_at'
      },
      deletedAt: {
        type: DATE,
        field: 'deleted_at'
      },
      updatedAt: {
        type: DATE,
        field: 'updated_at'
      }
    };
  }

  static associate({ Assertion }) {
    this.hasMany(Assertion, {
      foreignKey: { name: 'badgeClassId', field: 'badge_class_id' }
    });
  }

  static options() {
    return {
      modelName: 'BadgeClass',
      tableName: 'badge_class',
      timestamps: true,
      paranoid: true,
      freezeTableName: true
    };
  }

  storeImage({ extension, base64data, hash }, currentHash) {
    const image = JSON.stringify({ extension, image: base64data });
    const key = this.id.toString();
    const item = { key, image };
    return store
      .fileExists(key)
      .then(() => store.getItem(key))
      .then(item => hash !== currentHash && store.setItem(item))
      .catch(() => store.setItem(item))
      .then(() => this);
  }

  getImage() {
    const { id } = this;
    const key = id.toString();
    return store.getItem(key);
  }

  loadImage() {
    const { dataValues } = this;
    return this.getImage().then(({ image, extension }) => {
      dataValues.image = `data:image/${extension};base64,${image}`;
    }).then(() => this);
  }
}

module.exports = BadgeClass;
