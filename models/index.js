'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const mysql = require('mysql2/promise'); 
const basename = path.basename(__filename);
const dotenv = require('dotenv');
const env = process.env.NODE_ENV || 'development';
dotenv.config();
const db = {};

const poolConfig = process.env.DB_POOL ? JSON.parse(process.env.DB_POOL) : {};
const envConfig = {
  host: process.env.DB_HOST,
  password:process.env.DB_PASSWORD,
  username:process.env.DB_USERNAME,
  database:process.env.DB_DATABASE,
  dialect: process.env.DB_DIALECT || 'mysql',
  pool: poolConfig,
}



async function initializeDatabase() {
  
  try {
    // Create the MySQL database if it doesn't exist
      const connection = await mysql.createConnection({
      host: envConfig.host,
      user: envConfig.username,
      password: envConfig.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${envConfig.database}\`;`);
    console.log(`Database ${envConfig.database} created or already exists.`);
    await connection.end();
  } catch (error) {
    console.error('Database creation error:', error);
  }
}

// Here I Initialize Sequelize

async function initializeSequelize() {
  await initializeDatabase();
  const  sequelize = new Sequelize(envConfig.database, envConfig.username, envConfig.password,
      {
        host: envConfig.host,
        dialect: envConfig.dialect,
        pool:envConfig.pool
      });
    

  fs
    .readdirSync(__dirname)
    .filter(file => {
      return (
        file.indexOf('.') !== 0 &&
        file !== basename &&
        file.slice(-3) === '.js' &&
        file.indexOf('.test.js') === -1
      );
    })
    .forEach(file => {
      const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
      db[model.name] = model;
    });

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
  return sequelize;
}



module.exports = { initializeSequelize, db };

