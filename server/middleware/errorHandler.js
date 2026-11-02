import ApiError from "../utils/ApiError.js";
import env from "../config/env.js";

// Runs when a request URL matches no route
export const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

// Runs whenever an error is thrown or passed to next()
export const errorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: statusCode === 500 ? "Internal server error" : err.message,
    ...(env.nodeEnv === "development" && { stack: err.stack }),
  });
};
