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

export const signRefreshToken = (session) => {
  return jwt.sign(
    { sub: session.user.toString(), family: session.family },
    env.jwtRefreshSecret,
    {
      expiresIn: `${env.jwtRefreshExpiresDays}d`,
      jwtid: session._id.toString(),
    },
  );
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, env.jwtRefreshSecret);
};
