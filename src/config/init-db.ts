import { pool } from './database';

//npx ts-node src/config/init-db.ts

const createTables = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS runners (
        id SERIAL PRIMARY KEY,
        bib VARCHAR(255),
        name VARCHAR(255),
        position NUMERIC,
        branch_position NUMERIC,
        category_position NUMERIC,
        laps NUMERIC,
        distance VARCHAR(255),
        mode VARCHAR(255),
        category VARCHAR(255),
        branch VARCHAR(255),
        club VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  
      );
    `);

    console.log('✅ Tablas creadas exitosamente');
  } catch (error) {
    console.error('❌ Error creando tablas:', error);
  }
};

createTables();