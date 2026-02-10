const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres', // Стандартты түрде 'postgres' деп атап қойдым
    password: '12345', // қойған пароліміз
    port:5432, // стандартты порт
});

module.exports = pool;