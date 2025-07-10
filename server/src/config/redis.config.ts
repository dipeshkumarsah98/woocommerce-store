import { ConnectionOptions } from 'bullmq';

const redisConfig: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  ...(process.env.REDIS_USERNAME && { username: process.env.REDIS_USERNAME }),
  ...(process.env.NODE_ENV === 'production' && { tls: {} }),
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
};

export default redisConfig;
