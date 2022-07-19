import { CitasDb } from "../assets/db/CitasDb";
import { ServerError } from "../assets/errors/ServerError";

export class RecomendacionesModel{
    constructor(){
        this._mainTable = `${process.env.DB_CITAS_SCHEMA}.recomendaciones`;
    }

    async recomendacionPersonalizado(payload){
        let SQL;
        try {
          SQL= await  CitasDb.getPoolConnection();
          let {rows}= await SQL.query(`
          SELECT * from ${this._mainTable} WHERE deprecated=false
          AND estatus=true
          AND (id=$1 OR $1 is null)
          AND (recomendacion=$2 OR $2 is null)
          order by ordenamiento,id;
          `,[payload.id,payload.recomendacion]);
          return rows;
        } catch (error) {
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
        
    }

    async recomendacionPersonalizadoGen(payload){
        let SQL;
        try {
          SQL= await  CitasDb.getPoolConnection();
          let {rows}= await SQL.query(`
          SELECT * from ${this._mainTable} WHERE deprecated=false
          AND (id=$1 OR $1 is null)
          AND (recomendacion=$2 OR $2 is null)
          order by ordenamiento,id;
          `,[payload.id,payload.recomendacion]);
          return rows;
        } catch (error) {
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
        
    }

    async recomendacionPersonalizadoGeneral(payload){
        let SQL;
        try {
          SQL= await  CitasDb.getPoolConnection();
          let {rows}= await SQL.query(`
          SELECT * from ${this._mainTable} WHERE 
           (id=$1 OR $1 is null)
          AND (recomendacion=$2 OR $2 is null)
          order by ordenamiento,id;
          `,[payload.id,payload.recomendacion]);
          return rows;
        } catch (error) {
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
        
    }

    async bajaRecomendacion(payload){

        const SQL= await  CitasDb.getPoolConnection();;
        try {
        SQL.query('BEGIN');
          let {rows}= await SQL.query(`
          UPDATE ${this._mainTable} 
          SET estatus=false, updated_at=now()
          WHERE id=$1;
          `,[payload.id]);
          await SQL.query('COMMIT');
          return true;
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }   
    }

    async altaRecomendacion(payload){

        const SQL= await  CitasDb.getPoolConnection();;
        try {
        SQL.query('BEGIN');
          let {rows}= await SQL.query(`
          UPDATE ${this._mainTable} 
          SET estatus=true, updated_at=now()
          WHERE id=$1;
          `,[payload.id]);
          await SQL.query('COMMIT');
          return true;
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }   
    }

    async activoRecomendacion(payload){
        const SQL= await  CitasDb.getPoolConnection();;
        try {
        SQL.query('BEGIN');
          let {rows}= await SQL.query(`
          UPDATE ${this._mainTable} 
          SET estatus=true, deprecated=false, updated_at=now()
          WHERE id=$1  RETURNING *;
          `,[payload.id]);
          await SQL.query('COMMIT');
          return rows[0];
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
        
    }

     async createElement(payload) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `INSERT INTO ${this._mainTable} 
                (recomendacion) 
                    VALUES ($1) 
                    RETURNING *;`,
                [payload.recomendacion]
            );
            await SQL.query(`COMMIT`);
            return rows[0];
        } catch (e) {
            await SQL.query(`ROLLBACK`);
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async updateOrdenamientoRecomendaciones(id,ordenamiento){
        let SQL;
        try {
            SQL = await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');
            let {rows} = await SQL.query(`
            UPDATE ${this._mainTable}
            SET ordenamiento=$2
            WHERE id=$1;
            `,[id,ordenamiento]);
            await SQL.query('COMMIT');
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(e);
        }  finally{
            CitasDb.closePoolConnection(SQL);
        }
    }
}