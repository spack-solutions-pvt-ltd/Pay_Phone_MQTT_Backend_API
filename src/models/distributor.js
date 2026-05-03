'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Distributor extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Operator, {
        foreignKey: "distributorId",
        as: "operators"
      })

      this.hasMany(models.Terminal, {
        foreignKey: "distributorId",
        as: "terminals"
      })
      this.hasMany(models.WalletTransaction, {
        foreignKey: "distributorId",
        as: "walletTransactions"
      })
    }
  }
  Distributor.init({
    distributorId: DataTypes.STRING,
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    companyName: DataTypes.STRING,
    gstNumber: DataTypes.STRING,
    location: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Blocked"),
      defaultValue: "Active"
    }
  }, {
    sequelize,
    modelName: 'Distributor',
  });
  return Distributor;
};