// models/product.js
const { Sequelize, DataTypes } = require('sequelize');
const Image = require('./productImages');
const ProductCategory = require('./productCategory');

const { sequelize } = require('../bin/config/database');

const Product = sequelize.define('products', {
    id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    name_ru: {
        type: Sequelize.STRING,
        allowNull: false
      },
    name_en: {
        type: Sequelize.STRING,
        allowNull: false
      },
    outer_carton: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    inner_carton: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    artikul: {
        type: Sequelize.STRING,
        allowNull: false
      },
    code: {
        type: Sequelize.STRING,
        allowNull: false
    },
    brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true,
    underscored:true
  });

Product.hasMany(Image, { as: 'images', foreignKey: "product_id", onDelete: 'cascade', hooks: true});

Product.hasMany(ProductCategory, {
    foreignKey: "product_id",
    as: 'items'
});

module.exports = Product;
