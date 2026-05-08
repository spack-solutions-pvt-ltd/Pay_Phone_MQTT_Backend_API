'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Terminals', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      terminalId: {
        type: Sequelize.STRING
      },
      simNo: {
        type: Sequelize.STRING
      },
      imei: {
        type: Sequelize.STRING
      },
      serialNo: {
        type: Sequelize.STRING
      },
      distributorId: {
        type: Sequelize.BIGINT
      },
      operatorId: {
        type: Sequelize.BIGINT
      },
      campus: {
        type: Sequelize.STRING
      },
      location: {
        type: Sequelize.STRING
      },
      firmwareVersion: {
        type: Sequelize.STRING
      },
      lastPingAt: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM(
          "Active",
          "Inactive",
          "Disconnected",
          "Faulted",
          "Blocked"
        ),
        defaultValue: "Inactive"
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
    await queryInterface.dropTable('Terminals');
  }
};