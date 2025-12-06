//IN THIS FILE WE WILL SET UP A BASIC EXPRESS SERVER AND INTEGRATE IT WITH THE GEMINI API

import express from 'express';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const genAi = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAi.getGenerativeModel({ model: 'gemini-2.5-flash' });

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Gemini API Express Server' });
});
app.post('/api/chat', async (req, res) => {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({ error: 'Message is required' });
    }
    try {
        const result = await model.generateContent(message);
        const response = result.response
        const text = response.text();
        // console.log(result);
        return res.json({ text });
    } catch (error) {
        console.error('Error generating content:', error);
        return res.status(500).json({ error: 'Failed to generate content' });
    }

});
app.post('/api/chat-with-system', async (req, res) => {
    const { systemMessage, userMessage } = req.body;
    if (!systemMessage || !userMessage) {
        return res.status(400).json({ error: 'System message and user message are required' });
    }   
    const fullMessage= systemMessage ? `${systemMessage}\nUser: ${userMessage}` : userMessage;
    try {
        const result = await model.generateContent(fullMessage);
        const text = result.response.text();
        return res.json({ text });
    } catch (error) {
        console.error('Error generating content:', error);
        return res.status(500).json({ error: 'Failed to generate content' });

        
    }
})
app.post('/api/chat-conversation', async (req, res) => {})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
