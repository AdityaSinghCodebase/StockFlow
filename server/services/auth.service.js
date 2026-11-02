import User from "../models/User.js";
import ApiError from "../utils/ApiError.js";
import { signAccessToken } from "../utils/tokens.js";

export const loginUser = async ({ email, password }) => {
  // The password is hidden by default, so we ask for it on purpose
  const user = await User.findOne({ email }).select("+password");

  // Same message for "no such email" and "wrong password"
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

  return {
    accessToken: signAccessToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  };
};
