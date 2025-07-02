'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Transactions', 'data', {
      type: Sequelize.DATE,
      allowNull: true, // ou false, se quiser obrigar sempre
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Transactions', 'data');
  }
};
