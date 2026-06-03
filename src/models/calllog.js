'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CallLog extends Model {
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

      this.belongsTo(models.Terminal, {
        foreignKey: "terminalId",
        as: "terminal"
      })
      // this.belongsTo(models.UserAssociatedNumber, {
      //   foreignKey: "associatedNumberId",
      //   as: "associatedNumbers"
      // })

    }
  }
  CallLog.init({
    callerId: DataTypes.STRING,
    userId: DataTypes.BIGINT,
    terminalId: DataTypes.BIGINT,
    phoneNumber: DataTypes.STRING,
    startTime: DataTypes.DATE,
    endTime: DataTypes.DATE,
    duration: DataTypes.INTEGER,
    creditsUsed: DataTypes.DECIMAL,
    status: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    rfidCardId: DataTypes.BIGINT,
    min_left: DataTypes.FLOAT,
    start_credits: DataTypes.DECIMAL,
    end_credits: DataTypes.DECIMAL,
    tid: DataTypes.STRING,
    cid: DataTypes.STRING,
    timeSlotId : DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'CallLog',
  });
  return CallLog;
};