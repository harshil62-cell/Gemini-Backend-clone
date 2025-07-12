const Redis = require('ioredis');
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
});

(async () => {
  await redis.set('foo', 'bar');
  const value = await redis.get('foo');
  console.log('Redis test:', value); 
})();