'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RFIDCard extends Model {
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
    }
  }
  RFIDCard.init({
    userId: DataTypes.BIGINT,
    cardNumber: DataTypes.STRING,
    status: {
      type: DataTypes.ENUM("Active", "Inactive", "Blocked", "Missing", "Lost", "Damaged", "Destroyed"),
      defaultValue: "Active",
    },
    operatorId: DataTypes.BIGINT,
  }, {
    sequelize,
    modelName: 'RFIDCard',
  });
  return RFIDCard;
};