const {Queue}=require('bullmq');
const Redis=require('ioredis');

const connection=new Redis();

const geminiQueue=new Queue('gemini',{connection});

module.exports=geminiQueue;