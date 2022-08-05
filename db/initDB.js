'use strict';

require('dotenv').config();
const { getDB } = require('./db');

async function main() {
  let connection;
  try {
    connection = await getDB();

    console.log(`Borrando las tablas...`);
    await connection.query(`DROP TABLE IF EXISTS places_complaints;`);
    await connection.query(`DROP TABLE IF EXISTS places_photos;`);
    await connection.query(`DROP TABLE IF EXISTS places;`);
    await connection.query(`DROP TABLE IF EXISTS users;`);

    console.log('Creando las tablas...');
    await connection.query(`
      CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(512) NOT NULL,
        name VARCHAR(100),
        avatar VARCHAR(50),
        active BOOLEAN DEFAULT false,
        role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
        registrationCode VARCHAR(100),
        deleted BOOLEAN DEFAULT false,
        lastAuthUpdate DATETIME,
        recoverCode VARCHAR(100)
      )
    `);

    await connection.query(`
      CREATE TABLE places (
        id INT PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        city VARCHAR(100) NOT NULL,
        distric VARCHAR(100) NOT NULL,
        problem_solved BOOLEAN DEFAULT false
      )
    `);

    await connection.query(`
      CREATE TABLE places_photos (
        id INT PRIMARY KEY AUTO_INCREMENT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        uploadDate DATETIME NOT NULL,
        photo VARCHAR(100) NOT NULL,
        place_id INT NOT NULL,
        FOREIGN KEY(place_id) REFERENCES places(id)
      )
    `);

    await connection.query(`
      CREATE TABLE places_complaints (
        id INT PRIMARY KEY AUTO_INCREMENT, 
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        complaint TINYINT NOT NULL, 
        place_id INT NOT NULL,
        FOREIGN KEY(place_id) REFERENCES places(id),
        CONSTRAINT places_complaints_CK1 CHECK (complaint IN(0,1)),
        user_id INT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id)
        -- CONSTRAINT uc_user_place UNIQUE (user_id , place_id)
      )
    `);

    console.log('Creo usuario admin...');
    await connection.query(`
        INSERT INTO users(created_at, email, password, name, active, role)
        VALUES(
            CURRENT_TIMESTAMP,
            'albertoleandro37@gmail.com',
            SHA2("${process.env.ADMIN_PASSWORD}", 512),
            "Alberto Leandro",
            true,
            "admin"
        )
    `);

    console.log('Creo usuario de prueba...');
    await connection.query(`
        INSERT INTO users(created_at, email, password, name, active)
        VALUES(
            CURRENT_TIMESTAMP,
            'albertoleandrocorral@gmail.com',
            SHA2("${process.env.USER_PASSWORD}", 512),
            "Berto Leandro",
            true
        )
    `);
  } catch (error) {
    console.error('ERROR:', error.message);
  } finally {
    if (connection) {
      connection.release();
    }
    process.exit();
  }
}

main();
