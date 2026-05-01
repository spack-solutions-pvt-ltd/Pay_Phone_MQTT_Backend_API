'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Operator extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Distributor, {
        foreignKey: "distributorId",
        as: "distributor"
      })

      this.hasMany(models.Terminal, {
        foreignKey: "operatorId",
        as: "terminals"
      })

      this.hasMany(models.User, {
        foreignKey: "operatorId",
        as: "users"
      })

      this.hasOne(models.Wallet, {
        foreignKey: "operatorId",
        as: "wallet"
      })

      // this.hasMany(models.WalletTransaction, {
      //   foreignKey: "operatorId",
      //   as: "walletTransactions"
      // })
    }
  }
  Operator.init({
    operatorId: DataTypes.STRING,
    distributorId: DataTypes.BIGINT,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    companyName: DataTypes.STRING,
    gstNumber: DataTypes.STRING,
    location: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Blocked"),
      defaultValue: "Active"
    }
  }, {
    sequelize,
    modelName: 'Operator',
  });
  return Operator;
};