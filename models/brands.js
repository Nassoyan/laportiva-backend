const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('laportiva', 'postgres', 'asdasd', {
  host: 'localhost',
  dialect: 'postgres', // Replace with your database dialect
});
const Product = require("./products")

const Brand = sequelize.define('brands', {
    id: {
        // allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
    name: {
        type: Sequelize.STRING,
        // allowNull: false,
    },
    image_url: {
        type: Sequelize.TEXT,
        // allowNull: false,
    },
}, {
  timestamps: true, // Set timestamps to true to enable automatic createdAt and updatedAt columns
});

Brand.hasMany(Product, { as: "products", foreignKey: "brand_id"} )


module.exports = Brand;
