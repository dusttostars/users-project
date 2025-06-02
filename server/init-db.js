// server/init-db.js

require('dotenv').config();
const { Pool } = require('pg');

/**
 * 1) createDatabaseIfNotExists():
 *    Connects to PG_DEFAULT_DATABASE (e.g. "postgres"),
 *    checks for PG_DATABASE, and creates it if missing.
 */
async function createDatabaseIfNotExists() {
  const defaultDbName = process.env.PG_DEFAULT_DATABASE || 'postgres';
  const targetDbName  = process.env.PG_DATABASE;

  // Connect to the "default" database
  const defaultPool = new Pool({
    user:     process.env.PG_USER,
    host:     process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port:     process.env.PG_PORT,
    database: defaultDbName,
  });

  try {
    // Check if PG_DATABASE already exists
    const { rowCount } = await defaultPool.query(
      'SELECT 1 FROM pg_database WHERE datname = $1',
      [targetDbName]
    );

    if (rowCount === 0) {
      // Create the database
      await defaultPool.query(`CREATE DATABASE "${targetDbName}"`);
      console.log(`🔹 Database "${targetDbName}" created.`);
    } else {
      console.log(`🔹 Database "${targetDbName}" already exists. Skipping creation.`);
    }
  } catch (err) {
    console.error('❌ Error in createDatabaseIfNotExists():', err);
    throw err;
  } finally {
    await defaultPool.end();
  }
}

/**
 * 2) initSchemaAndSeed():
 *    Connects to PG_DATABASE and creates the "users" table if needed,
 *    then seeds it with initial rows if it’s empty.
 */
async function initSchemaAndSeed() {
  const pool = new Pool({
    user:     process.env.PG_USER,
    host:     process.env.PG_HOST,
    password: process.env.PG_PASSWORD,
    port:     process.env.PG_PORT,
    database: process.env.PG_DATABASE,
  });

  try {
    // Create "users" table if it doesn’t exist
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE
      );
    `);

    // Check if "users" is empty, then seed
    const { rows } = await pool.query('SELECT COUNT(*) AS count FROM users;');
    const count = parseInt(rows[0].count, 10);

    if (count === 0) {
      await pool.query(`
        INSERT INTO users (name, email) VALUES
          ('Alice', 'alice@example.com'),
          ('Bob',   'bob@example.com');
      `);
      console.log('🔹 Inserted initial users.');
    } else {
      console.log('🔹 Users already exist. Skipping seed.');
    }

    console.log('✅ Database schema and seed complete.');
  } catch (err) {
    console.error('❌ Error in initSchemaAndSeed():', err);
    throw err;
  } finally {
    await pool.end();
  }
}

/**
 * 3) initDb(): orchestrates steps 1 + 2
 */
async function initDb() {
  await createDatabaseIfNotExists();
  await initSchemaAndSeed();
}

module.exports = initDb;
