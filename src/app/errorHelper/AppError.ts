type AppErrorType = Error & { statusCode: number };

const createAppError = (
  statusCode: number,
  message: string,
  stack?: string,
): AppErrorType => {
  const error = new Error(message) as AppErrorType;

  error.statusCode = statusCode;

  if (stack) {
    error.stack = stack;
  } else {
    Error.captureStackTrace(error, createAppError);
  }

  return error;
};

export const AppError = createAppError;
