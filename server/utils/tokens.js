import jwt from "jsonwebtoken";
import env from "../config/env.js";

export const signAccessToken = (user) => {
  return jwt.sign(
    { sub: user._id.toString(), role: user.role },
    env.jwtAccessSecret,
    { expiresIn: env.jwtAccessExpiresIn },
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, env.jwtAccessSecret);
};
