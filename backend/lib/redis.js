import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

export const redis = new Redis(process.env.REDIS_URL);
// connection events for debugging
redis.on('connect', () => console.log('ioredis: connecting to', process.env.REDIS_URL));
redis.on('ready', () => console.log('ioredis: ready')); 
redis.on('error', (err) => console.error('ioredis error:', err && err.message));
redis.on('close', () => console.log('ioredis: connection closed'));
