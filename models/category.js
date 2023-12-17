// models/category.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../bin/config/database');
const ProductCategory = require('./productCategory');
const Product = require('./product');


const Category = sequelize.define('category', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  timestamps: true,
  underscored: true,
});


module.exports = Category;