import env from "../config/env.js";

export const REFRESH_COOKIE = "refreshToken";

export const refreshCookieOptions = {
  httpOnly: true,
  secure: env.nodeEnv === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: env.jwtRefreshExpiresDays * 24 * 60 * 60 * 1000,
};
