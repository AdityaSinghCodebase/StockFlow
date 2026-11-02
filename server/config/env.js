import "dotenv/config";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};

if (!env.mongoUri) {
  console.error("Missing MONGO_URI in .env file");
  process.exit(1);
}

export default env;
