'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TerminalLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Terminal, {
        foreignKey: "terminalId",
        as: "terminal"
      })
    }
  }
  TerminalLog.init({
    terminalId: DataTypes.BIGINT,
    from: DataTypes.STRING,
    message: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TerminalLog',
  });
  return TerminalLog;
};