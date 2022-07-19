import { CitasDb } from '../assets/db/CitasDb';
import { ServerError } from '../assets/errors/ServerError';
import moment from 'moment-timezone';

export class Dia {
  constructor() {
    this._mainTable = `${process.env.DB_CITAS_SCHEMA}.dias`;
  }

  async createElement(payload) {
    const SQL = await CitasDb.getPoolConnection();
    try {
      let {
        rows
      } = await SQL.query(
        `INSERT INTO ${this._mainTable} (fecha) VALUES ($1) RETURNING *;`,
        [moment(moment(payload.fecha, 'DD/MM/YYYY')).format('YYYY-MM-DD')]
      );
      return rows;
    } catch (e) {
      throw new ServerError(e);
    } finally {
      CitasDb.closePoolConnection(SQL);
    }
  }

  async getElements() {
    const SQL = await CitasDb.getPoolConnection();
    try {
      let { rows } = await SQL.query(
        `SELECT id, to_char(fecha, 'YYYY/MM/DD') as fecha, deprecated, created_at, updated_at 
          FROM ${this._mainTable} 
          where deprecated=false 
          ORDER BY created_at;`
      );
      return rows;
    } catch (e) {
      throw new ServerError(e);
    } finally {
      CitasDb.closePoolConnection(SQL);
    }
  }

  async getElementByDate(date) {
    const SQL = await CitasDb.getPoolConnection();
    try {
      let {
        rows
      } = await SQL.query(
        `SELECT * FROM ${this._mainTable} WHERE fecha::DATE = $1 AND deprecated = false;`,
        [date]
      );
      return rows;
    } catch (e) {
      throw new ServerError(e);
    } finally {
      CitasDb.closePoolConnection(SQL);
    }
  }

  async toState(payload) {
    const SQL = await CitasDb.getPoolConnection();
    try {
      let {
        rowCount
      } = await SQL.query(
        `UPDATE ${this._mainTable} SET deprecated = $1 WHERE id = $2;`,
        [payload.estado, payload.id]
      );
      return rowCount > 0 ? true : false;
    } catch (e) {
      throw new ServerError(e);
    } finally {
      CitasDb.closePoolConnection(SQL);
    }
  }
}
