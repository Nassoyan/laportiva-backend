// models/image.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('laportiva', 'postgres', 'asdasd', {
  host: 'localhost',
  dialect: 'postgres', // Replace with your database dialect
});

const Image = sequelize.define('product_images', {
  // Define image model attributes here
  id: {
    type: Sequelize.INTEGER,
    allowNull: false,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  image_url: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  product_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  
}, {
    timestamps: true,
    underscored:true // Set timestamps to true to enable automatic createdAt and updatedAt columns
  });

module.exports = Image;
