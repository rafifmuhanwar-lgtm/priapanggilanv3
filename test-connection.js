const dotenv = require('dotenv');
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("❌ Error: API Key is missing in .env file.");
    process.exit(1);
}

console.log("Checking API Key availability...");
console.log(`Key being used: ${API_KEY.substring(0, 10)}...`);

async function checkModels() {
    try {
        // Direct REST call to list models
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);

        if (!response.ok) {
            const data = await response.json();
            console.error(`❌ API Request Failed! Status: ${response.status}`);
            console.error("Details:", JSON.stringify(data, null, 2));
            return;
        }

        const data = await response.json();
        const models = data.models || [];

        console.log("✅ Connection Successful!");
        console.log("Available Models for your Key:");
        models.forEach(m => {
            if (m.name.includes('gemini')) {
                console.log(` - ${m.name.replace('models/', '')}`);
            }
        });

    } catch (error) {
        console.error("❌ Network or Script Error:", error);
    }
}

checkModels();
