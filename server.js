const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serve frontend files

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

// Mock response for testing without API key
const mockResponse = "Ini adalah respon contoh karena API Key Gemini belum dikonfigurasi. Silakan cek .env file Anda.";

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message is required' });
        }

        if (!process.env.GEMINI_API_KEY) {
            console.warn("Gemini API Key missing, returning mock response");
            return res.json({ reply: mockResponse });
        }

        // Using gemini-flash-latest as a safe alias from the user's list
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // System Instruction to enforce Indonesian Language
        const systemInstruction = "Kamu adalah asisten AI yang sangat membantu, pintar, dan berkelas. Kamu WAJIB selalu menjawab dalam Bahasa Indonesia yang baik dan benar (boleh sedikit gaul/santai tapi tetap sopan). Jangan pernah menjawab dengan bahasa lain kecuali diminta menerjemahkan.";

        const finalPrompt = `${systemInstruction}\n\nUser: ${message}`;

        const result = await model.generateContent(finalPrompt);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error("Error calling Gemini API:", error);

        let errorMessage = error.message;
        if (error.message.includes('API key')) {
            errorMessage = "API Key Anda salah atau tidak valid. Cek .env file.";
        }

        res.status(500).json({ error: errorMessage });
    }
});

// Export the app for Vercel (Serverless)
module.exports = app;

// Only start the server if running locally (not imported as a module)
if (require.main === module) {
    app.listen(port, () => {
        console.log(`Server running at http://localhost:${port}`);
        console.log(`Gemini API Key loaded: ${process.env.GEMINI_API_KEY ? 'Yes' : 'No'}`);
        if (!process.env.GEMINI_API_KEY) {
            console.log("WARNING: Please check your .env file and restart the server.");
        }
    });
}
