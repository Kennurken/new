const pool = require('./db');

async function findMasters(specialty){
    try {
        console.log(`🔍 Іздеу басталды... ${specialty} ізделуде...`);
        const res = await pool.query(
            `SELECT * FROM professionals WHERE specialty = $1`,
             [specialty]
);
    if(res.rows.length > 0){
        console.log("✅ Маман табылды:", res.rows);
        console.table(res.rows);
    } else {
        console.log("⚠️ Маман табылмады.");
    }
    } catch (err) {
        console.error("❌ Қате:", err.message);
    } finally {
        pool.end();
    }
}
findMasters('Usta Master');