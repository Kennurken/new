const pool = require('./db');

async function deleteMaster(phone){
    try {
        const res = await pool.query(
            'DELETE FROM professionals WHERE phone = $1 RETURNING *',
            [phone]
        );
        if (res.rows.length > 0 ){
            console.log('✅ Маман жойылды:', res.rows[0].name);
        } else {
            console.log('⚠️ өшіретін ештеңе табылмады.');
        } 
    }catch (err) {
        console.error("❌ Қате:", err.message);
    } finally{
        pool.end();
    }
}
// Тест: deleteMaster('77754914123');