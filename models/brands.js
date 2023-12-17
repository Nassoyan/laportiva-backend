const { Sequelize,  DataTypes } = require('sequelize');
const { sequelize } = require("../bin/config/database"); 
const Product = require("./product")

const Brand = sequelize.define('brands', {
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
    image_url: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
  timestamps: true, 
});

Brand.hasMany(Product, { as: "product", foreignKey: "brand_id"} )


module.exports = Brand;
