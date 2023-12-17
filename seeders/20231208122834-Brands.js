'use strict';
const faker = require('@faker-js/faker');
const brands = [
  {
    name: 'Wilmax',
    image_url : 'qweqweqwe'
  },
  {
    name: 'Moloz',
    image_url : 'qweqwe'
  },
  {
    name: 'Popoz',
    image_url : 'asdasd'
  }
]

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize, faker) {
     await queryInterface.bulkInsert('brands', brands, {});
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
