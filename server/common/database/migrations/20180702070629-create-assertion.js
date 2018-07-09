'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable(
    'assertion',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        unique: true
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
      narrative: {
        type: Sequelize.TEXT
      },
      expires: {
        type: Sequelize.DATE
      },
      revoked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      }
    })
    .then(() => queryInterface.addConstraint(
      'assertion',
      ['badge_class_id', 'recipient_id'],
      {
        type: 'unique'
      })),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('assertion')
};
