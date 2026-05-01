'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserAssociatedNumber extends Model {
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
      
      this.hasMany(models.CallLog, {
        foreignKey: "associatedNumberId",
        as: "callLogs"
      })
    }
  }
  UserAssociatedNumber.init({
    userId: DataTypes.BIGINT,
    phoneNumber: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserAssociatedNumber',
  });
  return UserAssociatedNumber;
};