const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenAI } = require("@google/genai");
require('dotenv').config();

const prisma = new PrismaClient();
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}, 
});

const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);
console.log("API key loaded");

const geminiWorker = new Worker('gemini', async (job) => {
  const { messageId, input } = job.data;
  console.log(input, "Input");
  
  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: input,
      config: {
        thinkingConfig: {
          thinkingBudget: 0, // Disables thinking
        },
      }
    });

    // Fix: Access the response text correctly
    const geminiReply = result.text;
    
    // Update the message with Gemini's actual response
    await prisma.message.update({
      where: { id: messageId },
      data: { response: geminiReply },
    });
    
    console.log(`Gemini response saved for message ${messageId}`);
    
  } catch (error) {
    console.error(`Gemini API failed:`, error.message);
    console.error('Full error:', error);
    
    // Optional: Save error to DB for UI feedback
    await prisma.message.update({
      where: { id: messageId },
      data: { response: '[Gemini API failed. Please try again later.]' },
    });
  }
}, { connection });

module.exports = geminiWorker;