const {Queue}=require('bullmq');
const Redis=require('ioredis');

const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});;

const geminiQueue=new Queue('gemini',{connection});

module.exports=geminiQueue;