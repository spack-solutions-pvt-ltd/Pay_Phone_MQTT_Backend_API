'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Terminal extends Model {
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

      this.belongsTo(models.Operator, {
        foreignKey: "operatorId",
        as: "operator"
      })

      this.hasMany(models.CallLog, {
        foreignKey: "terminalId",
        as: "callLogs"
      })

      this.hasMany(models.TerminalLog, {
        foreignKey: "terminalId",
        as: "terminalLogs"
      })

    }
  }
  Terminal.init({
    terminalId: {
      type: DataTypes.STRING,
      unique: true,
    },
    simNo: DataTypes.STRING,
    imeiNo: DataTypes.STRING,
    serialNo: DataTypes.STRING,
    distributorId: DataTypes.BIGINT,
    operatorId: DataTypes.BIGINT,
    campus: DataTypes.STRING,
    location: DataTypes.STRING,
    firmwareVersion: DataTypes.STRING,
    lastPingAt: DataTypes.DATE,
    status: {
      type: DataTypes.ENUM(
        "Active",
        "Inactive",
        "Disconnected",
        "Faulted",
        "Blocked"
      ),
      defaultValue: "Inactive"
    },
    sstr: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Terminal',
  });
  return Terminal;
};