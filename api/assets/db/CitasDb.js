import { DB_CITAS_CONFIG } from "../configs/dbConnection";
import { Pool } from "pg";

export class CitasDb {
  constructor() {
    this.poolConnection = null;
  }

  static getPoolConnection() {
    if (!this.poolConnection) {
      this.poolConnection = new Pool({
        ...DB_CITAS_CONFIG,
        max: 10,
        idleTimeoutMillis: 20000,
        connectionTimeoutMillis: 10000
      });
    }
    return this.poolConnection.connect();
  }

  static closePoolConnection(poolConnection) {
    poolConnection.release();
  }
}
