export const notFound = (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;

  let message = err.message || "Internal Server Error";

  let details;

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";

    details = Object.values(err.errors).map((error) => error.message);
  }

  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid value for field "${err.path}"`;
  }

  // Duplicate key
  if (err.code === 11000) {
    statusCode = 409;
    message = "Duplicate resource";
  }

  if (statusCode >= 500) {
    console.error(err.stack || err);
  }

  return res.status(statusCode).json({
    success: false,
    message,

    ...(details && {
      details,
    }),

    ...(process.env.NODE_ENV === "development" &&
      statusCode >= 500 && {
        stack: err.stack,
      }),
  });
};
