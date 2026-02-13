const express = require('express');
const cors = require('cors');
const { Pool } = require('pg'); // PostgreSQL-ге қосылу үшін

const app = express();
app.use(cors()); // React-қа рұқсат беру
app.use(express.json());

// Базаға қосылу (db.js-тегі деректерді осы жерге жаз)
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'usta_db', // Өз базаңның аты
  password: 'төмендегі_паролің',
  port: 5432,
});

// 1. Барлық мамандарды алу API-і
app.get('/api/specialists', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM specialists');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Сервер қатесі');
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend сервер http://localhost:${PORT} портында қосылды!`);
});