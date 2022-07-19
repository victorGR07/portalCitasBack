import { GraphQLError } from "graphql";
import { Telegram } from "../../helpers/telegram";
import moment from "moment-timezone";

export class ValidationError extends GraphQLError {
  constructor(error) {
    super(error.message);
    this._name = "Parametros invalidos";
    this.HTTPStatus = 400;
    (this.field = error.path),
      (this.params = {
        values: error.value,
        error: error.params
      });
    this.time = moment(new Date())
      .tz("America/Mexico_City")
      .format();
    this.stack = error.stack;
  }

  review() {
    return {
      name: this._name,
      message: this.message,
      description: {
        stack: this.stack,
        field: this.field,
        params: this.params
      },
      time: this.time
    };
  }

  toJSON() {
    return {
      name: this._name,
      message: this.message,
      description: {
        HTTPStatus: this.HTTPStatus,
        field: this.field,
        params: this.params
      },
      time: this.time
    };
  }

  notify() {
    Telegram.sendMessage(JSON.stringify(this.toJSON()));
  }
}
