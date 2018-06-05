'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('badge', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    description: {
      type: Sequelize.TEXT,
      allowNull: false
    },
    criteriaUrl: {
      type: Sequelize.STRING,
      field: 'criteria_url',
    },
    criteriaNarrative: {
      type: Sequelize.TEXT,
      field: 'criteria_narrative'
    },
    imageCaption: {
      type: Sequelize.STRING,
      field: 'image_caption'
    },
    imageAuthorIri: {
      type: Sequelize.TEXT,
      field: 'image_author_iri'
    },
    imageHash: {
      type: Sequelize.STRING,
      field: 'image_hash',
      allowNull: false
    },
    tags: {
      type: Sequelize.ARRAY(Sequelize.STRING)
    },
    createdAt: {
      type: Sequelize.DATE,
      field: 'created_at',
      allowNull: false
    },
    updatedAt: {
      type: Sequelize.DATE,
      field: 'updated_at',
      allowNull: false
    },
    deletedAt: {
      type: Sequelize.DATE,
      field: 'deleted_at'
    }
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('badge')
};
