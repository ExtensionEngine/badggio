'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('recipient', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true
    },
    hash: {
      type: Sequelize.CHAR(71),
      unique: true
    },
    salt: {
      type: Sequelize.CHAR(64),
      unique: true
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('recipient')
};
