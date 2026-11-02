import dns from "node:dns";
import mongoose from "mongoose";
import env from "./env.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(env.mongoUri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDb Connection failed: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
