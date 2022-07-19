import { INFO } from "../configs/info";
import { ServerError } from "../errors/ServerError";
import { ValidationError } from "../errors/ValidationError";
import { ForbiddenError } from "../errors/ForbiddenError";

export class Error {
  constructor() {}

  static parse(error, request, response, next) {
    let errorObject = {
      status: error.status || 500,
      name: error.name,
      message: error.message,
      APIService: INFO
    };
    response.status(errorObject.status).json(errorObject);
  }

  static centralize(error) {
    let final = error.originalError;
    if (final) {
      if (
        !(
          final instanceof ServerError ||
          final instanceof ValidationError ||
          final instanceof ForbiddenError
        )
      ) {
        final = new ServerError(error.originalError);
      }
    }

    if(final.review && process.env.NODE_ENV == 'DEV')

    if (final instanceof ServerError && final.notify)
      final.notify();

    if(final.toJSON)
      return final.toJSON();
    return final;
  }
}
