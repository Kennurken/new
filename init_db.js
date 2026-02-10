const pool = require('./db');

async function start() {
    try {
        // 1. Кесте құрамыз
        await pool.query(`
            CREATE TABLE IF NOT EXISTS professionals (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                phone TEXT UNIQUE NOT NULL,
                specialty TEXT,
                lat DOUBLE PRECISION,
                long DOUBLE PRECISION
            );
        `);
        console.log("🏢 Кесте құрылды!");

        // 2. Тест ретінде маман қосамыз
        const res = await pool.query(
            'INSERT INTO professionals (name, phone, specialty, lat, long) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            ['Елдос', '77754914123', 'Usta Master', 43.2389, 76.8897]
        );
        
        console.log("✅ Маман сақталды:", res.rows[0]);
    } catch (err) {
        console.error("❌ Қате:", err.message);
    } finally {
        pool.end();
    }
}

start();