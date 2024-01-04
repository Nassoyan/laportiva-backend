const { Sequelize } = require('sequelize');
const { sequelize } = require('../bin/config/database');
const Product = require('./product');
const Category = require('./Category');

const ProductCategory = sequelize.define('product_categories', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER,
  },
  product_id: {
    type: Sequelize.INTEGER,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  category_id: {
    type: Sequelize.INTEGER,
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  },
  created_at: { 
    type: Sequelize.DATE,
  },
  updated_at: {
    type: Sequelize.DATE,
  },
}, {
  timestamps: true,
  underscored: true,
});

module.exports = ProductCategory;
