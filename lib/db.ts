import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your env file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectToMongodb() {
  if (cached.conn) { // if connection connected
    return cached.conn;
  }

  if (!cached.promise) { // if not connected
    
    const opts = {
      bufferCommands: true,
      maxPoolSize: 10,  // at a time how many connections requsted send
    };
    cached.promise = mongoose.connect(MONGODB_URI, opts).then(() => mongoose.connection);
  }

  try {
    cached.conn = await cached.promise; //send the promise into connection
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conn;
}
