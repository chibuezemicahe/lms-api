'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const mysql = require('mysql2/promise'); 
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};


async function initializeDatabase() {
  try {
    // Create the MySQL database if it doesn't exist
      const connection = await mysql.createConnection({
      host: config.host,
      user: config.username,
      password: process.env.SQLPASS || config.password,
    });

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    console.log(`Database ${config.database} created or already exists.`);
    await connection.end();
  } catch (error) {
    console.error('Database creation error:', error);
  }
}

// Here I Initialize Sequelize

async function initializeSequelize() {
  await initializeDatabase();
  let sequelize;
  if (config.use_env_DB_URL) {
    sequelize = new Sequelize(process.env.DB_URL, config);
  } else {
    sequelize = new Sequelize(config.database, config.username, process.env.SQLPASS || config.password,
      {
        host: config.host,
        dialect: config.dialect,
        pool:config.pool
      });
  }

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

