import { ApplicationError } from "./applicationError.js";

export function createError(error, overrides) {
    return new ApplicationError(error, overrides);
}