import { ApplicationError } from "./applicationError.js";

export const CommonError = {
    // Predefined 4xx http errors
    BAD_REQUEST: {
        type: ApplicationError.type.NETWORK,
        code: "BAD_REQUEST",
        message: "Bad request",
        statusCode: 400,
    },
    UNAUTHORIZED: {
        type: ApplicationError.type.NETWORK,
        code: "UNAUTHORIZED",
        message: "Unauthorized",
        statusCode: 401,
    },
    FORBIDDEN: {
        type: ApplicationError.type.NETWORK,
        code: "FORBIDDEN",
        message: "Forbidden",
        statusCode: 403,
    },
    RESOURCE_NOT_FOUND: {
        type: ApplicationError.type.NETWORK,
        code: "RESOURCE_NOT_FOUND",
        message: "Resource not found",
        statusCode: 404,
        meta: {
            translationKey: "app.common.error.RESOURCE_NOT_FOUND",
        },
    },

    // Predefined 5xx http errors
    INTERNAL_SERVER_ERROR: {
        type: ApplicationError.type.NETWORK,
        code: "INTERNAL_SERVER_ERROR",
        message: "Something went wrong, Please try again later.",
        statusCode: 500,
        meta: {
            shouldRedirect: true,
        },
    },
    BAD_GATEWAY: {
        type: ApplicationError.type.NETWORK,
        code: "BAD_GATEWAY",
        message: "Bad gateway",
        statusCode: 502,
    },
    SERVICE_UNAVAILABLE: {
        type: ApplicationError.type.NETWORK,
        code: "SERVICE_UNAVAILABLE",
        message: "Service unavailable",
        statusCode: 503,
    },
    GATEWAY_TIMEOUT: {
        type: ApplicationError.type.NETWORK,
        code: "GATEWAY_TIMEOUT",
        message: "Gateway timeout",
        statusCode: 504,
    },
};

export const Errors = {
    DEFAULT_ERROR: {
        type: ApplicationError.type.APP_NAME,
        code: 'DEFAULT_ERROR',
        message: 'API has some internal error',
        statusCode: 400
    },
    USER_ADDRESS_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'USER_ADDRESS_INVALID',
        message: 'Request parameter - user address is invalid',
        statusCode: 400
    },
    DATA_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'DATA_INVALID',
        message: 'Request parameter - post data is invalid',
        statusCode: 400
    },
    EVENT_ID_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'EVENT_ID_INVALID',
        message: 'Request parameter - event id is invalid',
        statusCode: 400
    },
    TICKET_ID_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'TICKET_ID_INVALID',
        message: 'Request parameter - ticket id is invalid',
        statusCode: 400
    },
    VERSION_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'VERSION_INVALID',
        message: 'Request parameter - version invalid',
        statusCode: 400
    },
    PLATFORM_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'PLATFORM_INVALID',
        message: 'Request parameter - platform invalid',
        statusCode: 400
    },
    TRANSACTION_FAILED: {
        type: ApplicationError.type.APP_NAME,
        code: 'TRANSACTION_FAILED',
        message: 'Smart contract - transaction is not successfull.',
        statusCode: 400
    },
    CHAIN_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'CHAIN_INVALID',
        message: 'Request parameter - chainid invalid',
        statusCode: 400
    },
    TOKEN_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'TOKEN_INVALID',
        message: 'Request parameter - token address invalid',
        statusCode: 400
    },
    USER_ALREADY_JOINED: {
        type: ApplicationError.type.APP_NAME,
        code: 'USER_ALREADY_JOINED',
        message: 'User already joined with current ticket in this event',
        statusCode: 400
    },
    VENUE_CONFIG_NOT_FOUND: {
        type: ApplicationError.type.APP_NAME,
        code: 'VENUE_CONFIG_NOT_FOUND',
        message: 'Venue configuration not available. Please contact system administrator',
        statusCode: 400
    },
    REGISTRATION_KEY_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'REGISTRATION_KEY_INVALID',
        message: 'API key is invalid or not authorized to access the API',
        statusCode: 403
    },
    AUTH_TOKEN_INVALID: {
        type: ApplicationError.type.APP_NAME,
        code: 'AUTH_TOKEN_INVALID',
        message: 'Auth-Token is invalid or not authorized to access the API',
        statusCode: 403
    },
}


export const HTTPCode = {
    "SUCCESSFUL": 200,
    "BAD_REQUEST": 400,
    "UNAUTHORIZED": 401,
    "FORBIDDEN": 403,
    "INTERNAL_SERVER": 500,
    "NOT_IMPLEMENTED": 501
}