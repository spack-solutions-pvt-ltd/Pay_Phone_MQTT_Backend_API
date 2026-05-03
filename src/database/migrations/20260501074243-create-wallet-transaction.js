'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WalletTransactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.BIGINT
      },
      walletId: {
        type: Sequelize.BIGINT
      },
      transactionId: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.BIGINT
      },
      operatorId: {
        type: Sequelize.BIGINT
      },
      amount: {
        type: Sequelize.DECIMAL
      },
      paymentMode: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.ENUM("Credit", "Debit")
      },
      transactionType: {
        type: Sequelize.ENUM("ADD_FUNDS", "CALL_DEDUCTION", "REFUND","DEDUCT_FUNDS")
      },
      distributorId:{
        type: Sequelize.BIGINT
      },
      remainingBalance: {
        type: Sequelize.DECIMAL
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
    await queryInterface.dropTable('WalletTransactions');
  }
};