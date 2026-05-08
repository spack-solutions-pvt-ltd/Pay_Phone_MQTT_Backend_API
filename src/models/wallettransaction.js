'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WalletTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Wallet, {
        foreignKey: "walletId",
        as: "wallet"
      })
      this.belongsTo(models.Distributor, {
        foreignKey: "distributorId",
        as: "distributor"
      })
      this.belongsTo(models.Operator, {
        foreignKey: "operatorId",
        as: "operator"
      })
    }
  }
  WalletTransaction.init({
    walletId: DataTypes.BIGINT,
    transactionId: DataTypes.STRING,
    amount: DataTypes.DECIMAL,
    paymentMode: DataTypes.STRING,
    transactionType: {
      type: DataTypes.ENUM("ADD_FUNDS", "CALL_DEDUCTION", "REFUND", "DEDUCT_FUNDS")
    },
    type: {
      type: DataTypes.ENUM("Credit", "Debit")
    },
    remainingBalance: DataTypes.DECIMAL,
    distributorId: DataTypes.BIGINT,
    operatorId: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'WalletTransaction',
  });
  return WalletTransaction;
};