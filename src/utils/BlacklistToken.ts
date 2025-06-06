import { redisClient } from '../config/redis';
import jwt from 'jsonwebtoken';

export const blacklistToken = async (userId: string) => {
  try {

    await redisClient.setEx(`blocked:${userId}`, 1296000, 'true');

  } catch (err) {
    console.error('Failed to blacklist token:', err);
  }
};
