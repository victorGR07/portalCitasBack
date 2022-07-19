import { CitasDb } from "../assets/db/CitasDb";
import { ServerError } from "../assets/errors/ServerError";


export class RolesModel{
   constructor(){
    this._mainTable = `${process.env.DB_CITAS_SCHEMA}.roles`;
   }


     async rolPersonalizado(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let  {rows}= await SQL.query(`
            SELECT * FROM ${this._mainTable} WHERE deprecated = false
            AND (id=$1 OR $1 is null)
            AND (nombre=$2 OR $2 is null);
            `,[payload.id,payload.nombre]);
            return rows;
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    
    }

    async rolPersonalizadoGeneral(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let  {rows}= await SQL.query(`
            SELECT * FROM ${this._mainTable} WHERE (id=$1 OR $1 is null)
            AND (nombre=$2 OR $2 is null);
            `,[payload.id,payload.nombre]);
            return rows;
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    
    }

    async activoRoles(id){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');
            let { rows } = await SQL.query(`
            UPDATE ${this._mainTable} 
            SET deprecated=false 
            WHERE id=$1 RETURNING *;
            `,[id])
            await SQL.query('COMMIT');
            return rows[0];
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }


 async addRoles(payload){
    let SQL;
    try {
        SQL= await CitasDb.getPoolConnection();
        await SQL.query('BEGIN');
        let { rows } = await SQL.query(`
        INSERT INTO ${this._mainTable} 
        (nombre) VALUES($1) RETURNING *;
        `,[payload.nombre])
        await SQL.query('COMMIT');
        return rows[0];
    } catch (error) {
        await SQL.query('ROLLBACK');
        throw new ServerError(error)
    }finally{
        CitasDb.closePoolConnection(SQL);
    }
}

}

