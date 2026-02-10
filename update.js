const pool = require('./db');

async function updateMaster(phone, newSpecialty){
    try {
        console.log(`🔄 Нөмірі ${phone} маманның деректері жаңартылуда...`);
        const res = await pool.query(
            'UPDATE professionals SET specialty = $1 WHERE phone = $2 RETURNING *',
            [newSpecialty, phone]
        );

        if(res.rows.length > 0){
            console.log("✅ Маман жаңартылды:", res.rows[0]);
        } else{
            console.log("⚠️ Мұндай нөмірлі маман табылмады.");
        }
      } catch (err) {
        console.error("❌ Қате:", err.message);
     } finally {pool.end()
    }
}
// "Елдостың" мамандығын өзгертіп көрейік
updateMaster('77754914123', 'Senior Fullstack Developer');