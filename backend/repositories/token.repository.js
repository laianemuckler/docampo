import * as redisClient from "../lib/redis.client.js";

const key = (userId) => `refresh_token:${userId}`;

export const setRefreshToken = async (userId, token) => {
  await redisClient.set(key(userId), token, 7 * 24 * 60 * 60); // 7 days
};

export const getRefreshToken = async (userId) => {
  return redisClient.get(key(userId));
};

export const deleteRefreshToken = async (userId) => {
  return redisClient.del(key(userId));
};
