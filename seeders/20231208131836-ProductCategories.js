'use strict';
const faker = require('@faker-js/faker');
const prodCat = [
  {
    product_id: 1,
    category_id: 2,
  },
  {
    product_id: 2,
    category_id: 1,
  },
  {
    product_id: 1,
    category_id: 3,
  },
  {
    product_id: 3,
    category_id: 2,
  },
  {
    product_id: 3,
    category_id: 3,
  }
  
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize, faker) {
    await queryInterface.bulkInsert('product_categories', prodCat, {});
 },

  async down (queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
