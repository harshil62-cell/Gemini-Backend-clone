const Redis = require('ioredis');
const redis = new Redis();

(async () => {
  await redis.set('foo', 'bar');
  const value = await redis.get('foo');
  console.log('Redis test:', value); 
})();