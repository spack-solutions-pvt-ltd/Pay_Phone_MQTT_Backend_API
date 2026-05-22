'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Manufacturer extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.WalletTransaction, {
        foreignKey: "manufacturerId",
        as: "walletTransactions"
      })
    }
  }
  Manufacturer.init({
    name: DataTypes.STRING,
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Blocked"),
      defaultValue: "Active"
    }
  }, {
    sequelize,
    modelName: 'Manufacturer',
  });
  return Manufacturer;
};