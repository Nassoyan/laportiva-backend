'use strict';
const faker = require('@faker-js/faker');
const products = [
  {
    name: 'Bajak',
    price: 3000,
    artikul: 3333,
    code: 123,
    brand_id: 1,
    created_at: '2023-12-12',
    updated_at: '2023-12-12'
  },
  {
    name: 'Apse',
    price: 23000,
    artikul: 3334,
    code: 124,
    brand_id: 2,
    created_at: '2023-12-12',
    updated_at: '2023-12-12'
  },
  {
    name: 'Grafin',
    price: 4000,
    artikul: 3335,
    code: 125,
    brand_id: 3,
    created_at: '2023-12-12',
    updated_at: '2023-12-12'
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize, faker) {
    await queryInterface.bulkInsert('products', products, {});
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
