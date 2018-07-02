'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('assertion', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    recipientId: {
      type: Sequelize.INTEGER,
      field: 'recipient_id',
      allowNull: false,
      references: {
        model: 'recipient',
        key: 'id'
      }
    },
    badgeClassId: {
      type: Sequelize.INTEGER,
      field: 'badge_class_id',
      allowNull: false,
      references: {
        model: 'badge_class',
        key: 'id'
      }
    },
    issuedOn: {
      type: Sequelize.DATE,
      field: 'issued_on',
      allowNull: false
    },
    narrative: {
      type: Sequelize.TEXT
    },
    expires: {
      type: Sequelize.DATE
    },
    revoked: {
      type: Sequelize.BOOLEAN
    },
    revocationReason: {
      type: Sequelize.STRING,
      field: 'revocation_reason'
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('assertion')
};
