import "dotenv/config";

const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 8000,
  mongoUri: process.env.MONGO_URI,
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
  jwtAccessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
};

if (!env.mongoUri) {
  console.error("Missing MONGO_URI in .env file");
  process.exit(1);
}

const required = ["mongoUri", "jwtAccessSecret", "jwtRefreshSecret"];
const missing = required.filter((key) => !env[key]);

if (missing.length > 0) {
  console.error(`Missing required environment settings: ${missing.join(", ")}`);
  process.exit(1);
}

export default env;
