import { CitasDb } from "../assets/db/CitasDb";
import { ServerError } from "../assets/errors/ServerError";

export class Estados {
    constructor(){
        this._mainTable = `${process.env.DB_CITAS_SCHEMA}.estados`;
    }

    async estadosPersonalizados(payload){
        let SQL;
        try {
            SQL = await CitasDb.getPoolConnection();
            let {rows}= await SQL.query(`
            SELECT * FROM  ${this._mainTable} WHERE deprecated=false
            AND (id=$1 OR $1 is null)
            AND (nombre=$2 OR $2 is null)
            `,[payload.id,payload.nombre]);
            return rows;
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }
}