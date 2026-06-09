require('dotenv').config();

const app = require('./src/app');
const env = require('./src/config/env');
const { testConnection } = require('./src/config/database');

const startServer = async () => {
  await testConnection();

  app.listen(env.app.port, () => {
    console.log(`Servidor iniciado en http://localhost:${env.app.port}`);
  });
};

startServer();