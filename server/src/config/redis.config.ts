import { ConnectionOptions } from 'bullmq';

const redisConfig: ConnectionOptions = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  username: process.env.REDIS_USERNAME,
  tls: {},
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  lazyConnect: true,
};

export default redisConfig;
