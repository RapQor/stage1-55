'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class myProject extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  myProject.init({
    projectName: DataTypes.STRING,
    startDate: DataTypes.DATEONLY,
    endDate: DataTypes.DATEONLY,
    description: DataTypes.STRING,
    nodeJs: DataTypes.BOOLEAN,
    reactJs: DataTypes.BOOLEAN,
    nextJs: DataTypes.BOOLEAN,
    typeScript: DataTypes.BOOLEAN,
    photo: DataTypes.STRING,
    author: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'myProject',
  });
  return myProject;
};