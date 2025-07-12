const { Worker } = require('bullmq');
const Redis = require('ioredis');
const { PrismaClient } = require('@prisma/client');
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const prisma = new PrismaClient();

// Improved Redis connection
const connection = new Redis(process.env.REDIS_URL, {
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
  keepAlive: 30000,
  connectTimeout: 10000,
  commandTimeout: 5000,
  tls: {
    rejectUnauthorized: false
  },
});

// Add connection event handlers
connection.on('error', (err) => {
  console.error('Redis connection error:', err);
});

connection.on('connect', () => {
  console.log('Connected to Redis successfully');
});

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
console.log("API key loaded");

const geminiWorker = new Worker('gemini', async (job) => {
  const { messageId, input } = job.data;
  console.log(input, "Input");
 
  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
    
    const result = await model.generateContent({
      contents: input,
    });
    
    const geminiReply = result.response.text();
   
    await prisma.message.update({
      where: { id: messageId },
      data: { response: geminiReply },
    });
   
    console.log(`Gemini response saved for message ${messageId}`);
   
  } catch (error) {
    console.error(`Gemini API failed:`, error.message);
    console.error('Full error:', error);
   
    await prisma.message.update({
      where: { id: messageId },
      data: { response: '[Gemini API failed. Please try again later.]' },
    });
  }
}, { connection });

module.exports = geminiWorker;