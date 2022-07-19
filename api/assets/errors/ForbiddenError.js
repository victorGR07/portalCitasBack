import { GraphQLError } from "graphql";
import moment from "moment-timezone";
import { Telegram } from "../../helpers/telegram";

export class ForbiddenError extends GraphQLError {
  constructor(message) {
    super(message);
    this._name = "Acceso restringido";
    this.HTTPStatus = 403;
    this.time = moment(new Date())
      .tz("America/Mexico_City")
      .format();
  }

  review() {
    return {
      name: this._name,
      message: this.message,
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
