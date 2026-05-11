'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Operator, {
        foreignKey: "operatorId",
        as: "operator"
      })

      this.hasMany(models.UserAssociatedNumber, {
        foreignKey: "userId",
        as: "associatedNumbers"
      })

      this.hasMany(models.UserActiveDay, {
        foreignKey: "userId",
        as: "activeDays"
      })

      this.hasMany(models.RFIDCard, {
        foreignKey: "userId",
        as: "rfidCards"
      })

      this.hasOne(models.Wallet, {
        foreignKey: "userId",
        as: "wallet"
      })

      this.hasMany(models.CallLog, {
        foreignKey: "userId",
        as: "callLogs"
      })

      this.hasMany(models.WalletTransaction, {
        foreignKey: "userId",
        as: "transaction"
      })
    }
  }
  User.init({
    userId: DataTypes.STRING,
    operatorId: DataTypes.BIGINT,
    fullName: DataTypes.STRING,
    phone: DataTypes.STRING,
    callDurationLimit: DataTypes.INTEGER,
    activeFrom: DataTypes.STRING,
    activeTo: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Blocked"),
      defaultValue: "Active"
    }
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};