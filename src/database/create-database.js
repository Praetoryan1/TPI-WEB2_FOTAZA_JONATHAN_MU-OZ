require('dotenv').config();
const mysql = require('mysql2/promise');

const dbName = process.env.DB_NAME || process.env.MYSQLDATABASE || 'fotaza_db';

const config = {
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  user: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || ''
};

const createDatabase = async () => {
  let connection;

  try {
    connection = await mysql.createConnection(config);

    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\`
       CHARACTER SET utf8mb4
       COLLATE utf8mb4_unicode_ci;`
    );

    console.log(`Base de datos "${dbName}" verificada o creada correctamente.`);
  } catch (error) {
    console.error('Error al crear/verificar la base de datos:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

createDatabase();