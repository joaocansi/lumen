"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceErrorType = void 0;
var ServiceErrorType;
(function (ServiceErrorType) {
    ServiceErrorType[ServiceErrorType["Unauthorized"] = 401] = "Unauthorized";
    ServiceErrorType[ServiceErrorType["NotFound"] = 404] = "NotFound";
    ServiceErrorType[ServiceErrorType["BadRequest"] = 400] = "BadRequest";
    ServiceErrorType[ServiceErrorType["Forbidden"] = 403] = "Forbidden";
    ServiceErrorType[ServiceErrorType["InternalServerError"] = 500] = "InternalServerError";
    ServiceErrorType[ServiceErrorType["AlreadyExists"] = 409] = "AlreadyExists";
})(ServiceErrorType || (exports.ServiceErrorType = ServiceErrorType = {}));
class ServiceError extends Error {
    message;
    error;
    constructor(message, error) {
        super(message);
        this.message = message;
        this.error = error;
    }
    toApiError(c) {
        return c.json({
            error: {
                message: this.message,
                code: this.error,
            },
        }, this.error);
    }
    static internalServerError(c) {
        return c.json({
            error: {
                message: "Internal server error",
                code: 500,
            },
        }, 500);
    }
}
exports.default = ServiceError;
