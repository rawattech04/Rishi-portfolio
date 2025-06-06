import mongoose from 'mongoose';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const MONGODB_URI = process.env.MONGODB_URI;

interface GlobalMongoose {
  isConnected?: boolean;
}

declare global {
  var mongoose: GlobalMongoose;
}

const mongooseGlobal = global.mongoose || {};
global.mongoose = mongooseGlobal;

async function dbConnect(): Promise<typeof mongoose> {
  try {
    if (mongooseGlobal.isConnected) {
      return mongoose;
    }

    const opts = {
      bufferCommands: true,
    };

    await mongoose.connect(MONGODB_URI, opts);
    mongooseGlobal.isConnected = mongoose.connection.readyState === 1;
    return mongoose;
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export default dbConnect; 