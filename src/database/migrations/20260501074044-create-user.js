'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      userId: {
        type: Sequelize.STRING
      },
      operatorId: {
        type: Sequelize.BIGINT
      },
      fullName: {
        type: Sequelize.STRING
      },
      phone: {
        type: Sequelize.STRING
      },
      cardNumber: {
        type: Sequelize.STRING
      },
      callDurationLimit: {
        type: Sequelize.INTEGER
      },
      activeFrom: {
        type: Sequelize.STRING
      },
      activeTo: {
        type: Sequelize.STRING
      },
      status: {
        type: Sequelize.ENUM("Active", "Inactive", "Blocked"),
        defaultValue: "Active"
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Users');
  }
};