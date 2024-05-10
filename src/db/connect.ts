import mongoose from "mongoose";
import logger from "../utils/logger";
import Redis from "ioredis";
import config from "../config";

export const redisClient = new Redis({
  host: config.redis.host,
  port: config.redis.port,
});

const uri = config.database.uri;

export async function connectDB() {
  try {
    if (uri) {
      await mongoose.connect(uri);
      logger.info("MongoDB connected!");
    } else {
      logger.info("Mongo uri unavailable.");
    }
  } finally {
    // await mongoose.disconnect();
  }
}
