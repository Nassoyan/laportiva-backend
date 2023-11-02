const { Sequelize, DataTypes } = require('sequelize');
const { sequelize } = require('../bin/config/database')

const Image = sequelize.define('product_images', {
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
  underscored: true // Set timestamps to true to enable automatic createdAt and updatedAt columns
});

module.exports = Image;
