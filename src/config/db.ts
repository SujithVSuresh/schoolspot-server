import { config } from 'dotenv';
config();

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI as string;

    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in the environment variables');
    }

    await mongoose.connect(mongoUri);
    console.log(`🍃 MongoDB connected to Authentication Service`);
  } catch (error) {
    console.error(`❌ MongoDB connection error:`, error);
    process.exit(1); // Optionally exit the process on failure
  }
};

export default connectDB;
