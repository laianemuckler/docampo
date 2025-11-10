import { redis } from "./redis.js";

export const get = async (key) => {
  return redis.get(key);
};

export const set = async (key, value, ttlSeconds) => {
  if (ttlSeconds) {
    return redis.set(key, value, "EX", ttlSeconds);
  }
  return redis.set(key, value);
};

export const del = async (key) => {
  return redis.del(key);
};

export default { get, set, del };
