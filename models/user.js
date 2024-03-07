const { Sequelize,  DataTypes } = require('sequelize');
const { sequelize } = require("../bin/config/database"); 

const User = sequelize.define('users', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  email: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  password: {
    type: Sequelize.STRING,
    allowNull: false,
  },
}, {
  timestamps: true, 
});


module.exports = User;