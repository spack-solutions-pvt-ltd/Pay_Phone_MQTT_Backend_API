'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CallLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      callerId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.BIGINT
      },
      terminalId: {
        type: Sequelize.BIGINT
      },
      associatedNumberId: {
        type: Sequelize.BIGINT
      },
      phoneNumber: {
        type: Sequelize.STRING
      },
      startTime: {
        type: Sequelize.DATE
      },
      endTime: {
        type: Sequelize.DATE
      },
      duration: {
        type: Sequelize.INTEGER
      },
      creditsUsed: {
        type: Sequelize.DECIMAL
      },
      status: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      rfidCardId: {
        type: Sequelize.BIGINT
      },
      min_left: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('CallLogs');
  }
};