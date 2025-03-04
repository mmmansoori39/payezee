export function formatError(error, overrides = {}) {
  const stackTrace = JSON.stringify(error, ["stack"], 4) || {};
  const newError = JSON.parse(JSON.stringify(error));

  // No need to send to client
  newError.statusCode = undefined;
  delete newError.meta;

  return {
    error: {
      ...newError,
      stack: stackTrace.stack
    },
    success: false,
    ...overrides
  };
}

export function formatResponse(result, override = {}) {
  return {
    data: result,
    success: true,
    ...override
  };
}

export function sendResponse(res, payload, statusCode = 200) {
  return res.status(statusCode).json(formatResponse(payload));
}
