import { CitasDb } from "../assets/db/CitasDb";
import { ServerError } from "../assets/errors/ServerError";
import { _bf_getElementById, _bf_createElement } from "../inspects/log";

export class Log {
  constructor() {
    this._mainTable = `"${process.env.DB_CITAS_SCHEMA}".logs`;
  }

  async getElementById(data) {
    let { id } = _bf_getElementById(data);
    const SQL = await CitasDb.getPoolConnection();
    try {
      let { rows } = await SQL.query(
        `SELECT * ` +
          `FROM ${this._mainTable} ` +
          `WHERE status = TRUE AND id = $1 ` +
          `LIMIT 1;`,
        [id]
      );
      return rows;
    } catch (e) {
      throw new ServerError(e);
    } finally {
      CitasDb.closePoolConnection(SQL);
    }
  }

  async getElementByNotificaion() {
    const SQL = await CitasDb.getPoolConnection();
    try {
      let { rows } = await SQL.query(
        `SELECT * 
          FROM ${this._mainTable} 
          WHERE descripcion ='Se hizo una notificación'
          and deprecated=false 
          order by id desc;`,
      );
      return rows;
    } catch (e) {
      throw new ServerError(e);
    } finally {
      CitasDb.closePoolConnection(SQL);
    }
  }


  async createElement(data) {
    const SQL = await CitasDb.getPoolConnection();
    try {
      await SQL.query(`BEGIN`);
      let {
        rows
      } = await SQL.query(
        `INSERT INTO ${this._mainTable} (id_usuario,descripcion,cliente,operacion) 
          VALUES ($1,$2,$3,$4)
          RETURNING *;`,
        [
          data.id_usuario,
          data.descripcion,
          data.cliente,
          data.operacion
        ]
      );
      await SQL.query(`COMMIT`);
      return rows;
    } catch (e) {
      await SQL.query(`ROLLBACK`);
      throw new ServerError(e);
    } finally {
      CitasDb.closePoolConnection(SQL);
    }
  }

}
