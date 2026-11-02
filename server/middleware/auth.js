import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { verifyAccessToken } from "../utils/tokens.js";

export const protect = async (req, res, next) => {
  // 1. Read the token from the Authorization header
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }
  const token = header.split(" ")[1];

  // 2. Verify the signature and expiry
  let payload;
  try {
    payload = verifyAccessToken(token);
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }

  // 3. Make sure the user still exists and is active
  const user = await User.findById(payload.sub);
  if (!user || user.status !== "active") {
    throw new ApiError(401, "Account not found or inactive");
  }

  // 4. Attach the user to the request for later code to use
  req.user = user;
  next();
};
