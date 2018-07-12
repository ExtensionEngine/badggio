'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn(
    'badge_class',
    'uuid',
    {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV4,
      allowNull: false,
      unique: true
    }
  ),
  down: (queryInterface, Sequelize) => queryInterface.removeColumn('badge_class', 'uuid')
};
