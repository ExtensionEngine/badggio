'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('badge_class', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING(50),
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    criteriaNarrative: {
      type: Sequelize.TEXT,
      field: 'criteria_narrative',
      allowNull: false
    },
    imageHash: {
      type: Sequelize.STRING,
      field: 'image_hash',
      allowNull: false
    },
    imageCaption: {
      type: Sequelize.STRING,
      field: 'image_caption'
    },
    imageAuthorIri: {
      type: Sequelize.STRING,
      field: 'image_author_iri'
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING),
      defaultValue: []
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at'
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('badge_class')
};
