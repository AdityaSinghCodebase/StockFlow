import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/tokens.js";
import crypto from "node:crypto";
import Session from "../models/Session.js";
import env from "../config/env.js";

export const loginUser = async ({ email, password }, meta = {}) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, "Invalid email or password");
  }

  if (user.status !== "active") {
    throw new ApiError(
      403,
      "Your account is inactive. Contact an administrator.",
    );
  }

  await User.updateOne({ _id: user._id }, { lastLoginAt: new Date() });

  // A new login starts a new session "family"
  const session = await Session.create({
    user: user._id,
    family: crypto.randomUUID(),
    expiresAt: new Date(
      Date.now() + env.jwtRefreshExpiresDays * 24 * 60 * 60 * 1000,
    ),
    userAgent: meta.userAgent,
    ip: meta.ip,
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(session),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};

export const refreshSession = async (token, meta = {}) => {
  // 1. Verify the signature and expiry
  let payload;
  try {
    payload = verifyRefreshToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired session. Please log in again.");
  }

  // 2. Revoke the session this token belongs to, but only if it is still active.
  //    This is one atomic operation, so two requests can't both use the same token.
  const now = new Date();
  const session = await Session.findOneAndUpdate(
    { _id: payload.jti, revokedAt: null, expiresAt: { $gt: now } },
    { revokedAt: now },
    { new: true },
  );

  // 3. No active session found: either it never existed, or the token was already used
  if (!session) {
    const known = await Session.findById(payload.jti);
    if (known) {
      // Reuse detected: revoke every session in this family
      await Session.updateMany(
        { family: known.family, revokedAt: null },
        { revokedAt: now },
      );
    }
    throw new ApiError(401, "Invalid or expired session. Please log in again.");
  }

  // 4. The user must still exist and be active
  const user = await User.findById(session.user);
  if (!user || user.status !== "active") {
    throw new ApiError(401, "Account not found or inactive");
  }

  // 5. Issue a new session in the same family (rotation)
  const newSession = await Session.create({
    user: user._id,
    family: session.family,
    expiresAt: new Date(
      Date.now() + env.jwtRefreshExpiresDays * 24 * 60 * 60 * 1000,
    ),
    userAgent: meta.userAgent,
    ip: meta.ip,
  });

  return {
    accessToken: signAccessToken(user),
    refreshToken: signRefreshToken(newSession),
  };
};
