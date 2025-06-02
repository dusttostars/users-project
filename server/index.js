// server/index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const initDb = require('./init-db');

const app = express();
const port = process.env.SERVER_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route: GET /api/users → return all users
app.get('/api/users', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users ORDER BY id;');
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/users error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route: POST /api/users → create a new user
app.post('/api/users', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Both name and email are required.' });
  }

  try {
    const insertResult = await pool.query(
      'INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *;',
      [name, email]
    );
    res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error('POST /api/users error:', err);
    if (err.code === '23505') {
      // Unique constraint violation on "email"
      return res.status(409).json({ error: 'Email already exists.' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server after initializing the database
(async () => {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('Failed to start server due to DB init error.');
    process.exit(1);
  }
})();
