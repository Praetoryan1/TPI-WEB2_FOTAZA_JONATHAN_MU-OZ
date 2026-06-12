require('dotenv').config();

const databaseConfig = {
  username: process.env.DB_USER || process.env.MYSQLUSER || 'root',
  password: process.env.DB_PASSWORD || process.env.MYSQLPASSWORD || null,
  database: process.env.DB_NAME || process.env.MYSQLDATABASE || 'fotaza_db',
  host: process.env.DB_HOST || process.env.MYSQLHOST || 'localhost',
  port: process.env.DB_PORT || process.env.MYSQLPORT || 3306,
  dialect: 'mysql',
  logging: false,
  define: {
    underscored: true,
    timestamps: true
  }
};

module.exports = {
  development: databaseConfig,
  test: {
    ...databaseConfig,
    database: `${process.env.DB_NAME || process.env.MYSQLDATABASE || 'fotaza_db'}_test`
  },
  production: databaseConfig
};