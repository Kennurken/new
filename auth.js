require('dotenv').config(); 
const redis = require('redis');
const axios = require('axios');

// API кілтті .env-ден немесе тікелей осы жерден алады
const API_KEY = process.env.MOBIZON_API_KEY || 'kzd8d67c7bf873ea7d553de5ba8bbd64b2003c682b38cae1a34fee3d448e01e5c612d5';

async function sendRealSMS(phoneNumber) {
    const client = redis.createClient({ url: 'redis://localhost:6379' });
    
    try {
        await client.connect();
        console.log("🌐 Redis-ке қосылдық...");

        const otpCode = Math.floor(1000 + Math.random() * 9000);

        // Redis-ке сақтау (120 секунд)
        await client.set(`otp:${phoneNumber}`, otpCode, { EX: 120 });
        console.log(`💾 Код сақталды: ${otpCode}`);

        console.log(`🚀 Жіберілуде: ${phoneNumber}...`);

        // Mobizon API-ға сұраныс
        const response = await axios.get('https://api.mobizon.kz/service/message/sendsmsmessage', {
            params: {
                apiKey: API_KEY,
                recipient: phoneNumber,
                // Мәтінді барынша қарапайым еттік:
                text: `Жандосян пахай дальше негритяночка ${otpCode}`, 
                from: '' // Бос қалдырсақ, Mobizon автоматты түрде "INFO" немесе "SMS" деп жібереді
            }
        });

        if (response.data.code === 0) {
            console.log(`✅ ЖЕҢІС! Провайдер қабылдады.`);
            console.log(`📋 Статус: ${response.data.message || 'Кезекке қойылды'}`);
        } else {
            console.log("❌ MOBIZON ҚАТЕСІ:");
            console.log(JSON.stringify(response.data, null, 2));
        }

    } catch (error) {
        console.log("⚠️ Қате:", error.message);
    } finally {
        await client.disconnect();
        console.log("🔌 Байланыс жабылды.");
    }
}

// ДОСЫҢНЫҢ НӨМІРІН ОСЫ ЖЕРГЕ ЖАЗ (7-ден бастап, плюссіз)
sendRealSMS('77002009510');