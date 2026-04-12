require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');

async function setupDatabase() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      name: process.env.DB_NAME,
      multipleStatements: true
    });

    console.log('Conectado a MySQL');

    const sql = fs.readFileSync('./src/shared/infrastructure/schema.sql', 'utf8');

    await connection.query(sql);

    console.log('Base de datos y tablas creadas correctamente');
    await connection.end();
  } catch (error) {
    console.error('Error en db:setup:', error.message);
  }
}

setupDatabase();