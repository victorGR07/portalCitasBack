import telegram from "telegram-bot-api";

export class Telegram {
  constructor() {
    this._instance = null;
  }

  static instance() {
    if (!this._instance) {
      this._instance = new telegram({
        token: process.env.TELEGRAM_KEY
      });
    }
    return this._instance;
  }

  static sendMessage(data) {
    let string = `
      <b> Error on citas_proveedores: </b> <i> ${data} </i>
    `;

    this.instance().sendMessage({
      chat_id: process.env.CHAT_ID,
      parse_mode: "HTML",
      text: string
    });
  }
}
