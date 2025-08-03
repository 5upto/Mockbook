const mysql = require('mysql2/promise');
require('dotenv').config();

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306
};

let connection = null;

const connectDB = async () => {
    try {
        // First connect without database to create it if it doesn't exist
        const tempConnection = await mysql.createConnection({
            host: dbConfig.host,
            user: dbConfig.user,
            password: dbConfig.password,
            port: dbConfig.port,
            database: dbConfig.database
        });

        // // Create database if it doesn't exist
        // await tempConnection.execute(`CREATE DATABASE IF NOT EXISTS ${dbConfig.database}`);
        // await tempConnection.end();

        // Now connect to the actual database
        connection = await mysql.createConnection(dbConfig);
        console.log('MySQL Connected...');

        // Create lookup tables
        await createLookupTables();

        return connection;
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

const createLookupTables = async () => {
    try {
        // Create lookup tables for different languages
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS book_titles (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        language VARCHAR(10) NOT NULL
      )
    `);

        await connection.execute(`
      CREATE TABLE IF NOT EXISTS authors (
        id INT AUTO_INCREMENT PRIMARY KEY,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        language VARCHAR(10) NOT NULL
      )
    `);

        await connection.execute(`
      CREATE TABLE IF NOT EXISTS publishers (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        language VARCHAR(10) NOT NULL
      )
    `);

        console.log('Lookup tables created successfully');
    } catch (error) {
        console.error('Error creating lookup tables:', error);
    }
};

const getConnection = () => connection;

module.exports = {
    connectDB,
    getConnection
};