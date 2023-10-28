// models/product.js
const { Sequelize, DataTypes } = require('sequelize');
const Image = require('./productImages');
const sequelize = new Sequelize('laportiva', 'postgres', 'asdasd', {
  host: 'localhost',
  dialect: 'postgres', // Replace with your database dialect
});

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
    price: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    artikul: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
    code: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
    brand_id: {
        type: Sequelize.INTEGER,
        allowNull: false
    },
}, {
    timestamps: true,
    underscored:true
     // Set timestamps to true to enable automatic createdAt and updatedAt columns
  });

Product.hasMany(Image, { as: 'images', foreignKey: "product_id", }); // Define the one-to-many relationship

module.exports = Product;
