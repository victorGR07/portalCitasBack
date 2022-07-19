import { GraphQLError } from "graphql";
import { Telegram } from "../../helpers/telegram";
import moment from "moment-timezone";

export class ServerError extends GraphQLError {
  constructor(error) {
    super(error.message);
    this._name = "Operación fallida";
    this.HTTPStatus = 500;
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
        stack: this.stack
      },
      time: this.time
    };
  }

  toJSON() {
    return {
      name: this._name,
      message: this.message,
      description: {
        HTTPStatus: this.HTTPStatus
      },
      time: this.time
    };
  }

  notify() {
    Telegram.sendMessage(JSON.stringify(this.toJSON()));
  }
}
