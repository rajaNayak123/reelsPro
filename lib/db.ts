import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your env file");
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conne: null, promise: null };
}

export async function connectToMongodb() {
  if (cached.conne) { // if connection connected
    return cached.conne;
  }

  if (!cached.promise) { // if not connected
    const opts = {
      bufferCommand: true,
      maxPoolSize: 10, // at a time how many connections requsted send
    };
    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then(() => mongoose.connection);
  }

  try {
    cached.conne = await cached.promise; //send the promise into connection
  } catch (error) {
    cached.promise = null;
    throw error;
  }
  return cached.conne;
}
