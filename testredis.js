const Redis = require('ioredis');
const connection = new Redis(process.env.REDIS_URL, {
  maxRetriesPerRequest: null,
  tls: {}, // ✅ Required for rediss://
});

(async () => {
  await connection.set('foo', 'bar');
  const value = await connection.get('foo');
  console.log('Redis test:', value); 
})();