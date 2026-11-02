import * as authService from "../services/auth.service.js";

import { refreshCookieOptions, REFRESH_COOKIE } from "../utils/cookies.js";
import ApiError from "../utils/ApiError.js";

export const login = async (req, res) => {
  const { accessToken, refreshToken, user } = await authService.loginUser(
    req.body,
    {
      ip: req.ip,
      userAgent: req.get("user-agent"),
    },
  );

  res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);

  res.status(200).json({
    success: true,
    data: { accessToken, user },
  });
};

export const getMe = async (req, res) => {
  const { _id, name, email, role, status } = req.user;

  res.status(200).json({
    success: true,
    data: { user: { id: _id, name, email, role, status } },
  });
};

export const refresh = async (req, res) => {
  const token = req.cookies[REFRESH_COOKIE];

  if (!token) {
    throw new ApiError(401, "Not authenticated. Please log in.");
  }

  try {
    const { accessToken, refreshToken } = await authService.refreshSession(
      token,
      {
        ip: req.ip,
        userAgent: req.get("user-agent"),
      },
    );

    res.cookie(REFRESH_COOKIE, refreshToken, refreshCookieOptions);
    res.status(200).json({ success: true, data: { accessToken } });
  } catch (error) {
    // A failed refresh means the cookie is useless, so remove it
    res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
    throw error;
  }
};
