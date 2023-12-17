'use strict';
const faker = require('@faker-js/faker');
const categories = [
  {
    parent_id: null,
    name: 'Metal',
  },
  {
    parent_id: null,
    name: 'Apaki',
  },
  {
    parent_id: null,
    name: 'Bamboo',
  }
]
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize, faker) {
    await queryInterface.bulkInsert('categories', categories, {});
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
