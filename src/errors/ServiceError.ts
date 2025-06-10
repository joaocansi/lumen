import { HonoContext } from "../@types/hono-context";

export enum ServiceErrorType {
  Unauthorized = 401,
  NotFound = 404,
  BadRequest = 400,
  Forbidden = 403,
  InternalServerError = 500,
  AlreadyExists = 409,
}

export default class ServiceError extends Error {
  constructor(
    public message: string,
    private error: ServiceErrorType
  ) {
    super(message);
  }

  toApiError(c: HonoContext) {
    return c.json(
      {
        error: {
          message: this.message,
          code: this.error,
        },
      },
      this.error
    );
  }

  static internalServerError(c: HonoContext) {
    return c.json(
      {
        error: {
          message: "Internal server error",
          code: 500,
        },
      },
      500
    );
  }
}
