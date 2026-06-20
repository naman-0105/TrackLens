class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = "Internal Server Error",
    details = undefined,
  ) {
    super(message);

    this.statusCode = statusCode;
    this.details = details;
    this.isApiError = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
