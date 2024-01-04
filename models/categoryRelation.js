// models/category.js
const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../bin/config/database');
const ProductCategory = require('./productCategory');
const Product = require('./product');


const CategoryRelation = sequelize.define('category_relation', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      parent_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      child_category_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
}, {
  timestamps: true,
  underscored: true,
});

// todo add relations associations hasMany()
// CategoryRelation.hasMany(category) -> references on category.id


module.exports = CategoryRelation;