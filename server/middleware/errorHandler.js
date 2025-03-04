import { ApplicationError } from "../utils/error/applicationError.js";
import { CommonError } from "../utils/error/commonError.js";
import { createError } from "../utils/error/errorFactory.js";
import { formatError, sendResponse } from "../utils/error/errorResponse.js";

export function errorHandler(err, req, res, next) {
  if (err instanceof ApplicationError) {
    const code = Number(err.statusCode || err.code || 500);
    return res.status(code).json(formatError(err));
  }

  if (err instanceof Error) {
    console.error(err);
    const newError = createError(err);
    const code = Number(newError.statusCode || newError.code || 500);
    return res.status(code).json(formatError(newError));
  }

  const unknownError = new ApplicationError(CommonError.INTERNAL_SERVER_ERROR);

  return sendResponse(res, unknownError, 500);
}
