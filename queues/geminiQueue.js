const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Improved Redis connection with better error handling and retry logic
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

// Add connection event handlers for debugging
connection.on('error', (err) => {
  console.error('Queue Redis connection error:', err);
});

connection.on('connect', () => {
  console.log('Queue connected to Redis successfully');
});

connection.on('ready', () => {
  console.log('Queue Redis connection is ready');
});

connection.on('close', () => {
  console.log('Queue Redis connection closed');
});

// Create the queue with the improved connection
const geminiQueue = new Queue('gemini', { 
  connection,
  defaultJobOptions: {
    removeOnComplete: 10, // Keep only 10 completed jobs
    removeOnFail: 5,      // Keep only 5 failed jobs
    attempts: 3,          // Retry failed jobs 3 times
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  }
});

// Add queue event handlers for better monitoring
geminiQueue.on('error', (err) => {
  console.error('Queue error:', err);
});

geminiQueue.on('waiting', (job) => {
  console.log(`Job ${job.id} is waiting`);
});

geminiQueue.on('active', (job) => {
  console.log(`Job ${job.id} is now active`);
});

geminiQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

geminiQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err.message);
});

console.log('Redis URL:', process.env.REDIS_URL ? 'Set' : 'Not set');

module.exports = geminiQueue;