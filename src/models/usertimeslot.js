'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTimeSlot extends Model {
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
  UserTimeSlot.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.BIGINT
    },
    userId: DataTypes.BIGINT,
    startTime: DataTypes.TIME,
    endTime: DataTypes.TIME,
    status: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'UserTimeSlot',
  });
  return UserTimeSlot;
};