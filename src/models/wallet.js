'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wallet extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user"
      })

      this.belongsTo(models.Operator, {
        foreignKey: "operatorId",
        as: "operator"
      })

      this.hasMany(models.WalletTransaction, {
        foreignKey: "walletId",
        as: "transactions"
      })
    }
  }
  Wallet.init({
    userId: DataTypes.BIGINT,
    operatorId: DataTypes.BIGINT,
    balance: DataTypes.DECIMAL,
    accountType: DataTypes.ENUM("Distributor", "Operator", "User")
  }, {
    sequelize,
    modelName: 'Wallet',
  });
  return Wallet;
};