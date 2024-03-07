const { Client } = require('pg');
const { Sequelize } = require('sequelize');
require('dotenv').config()

const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

client.connect(function(err) {
  if (err)  {
    throw err;
  } else {
    console.log("Connected!");
  }
    
});

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  port: process.env.DB_PORT,
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT,
});

module.exports = { sequelize, client };
