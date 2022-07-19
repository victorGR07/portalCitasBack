import { CitasDb } from "../assets/db/CitasDb";
import { ServerError } from "../assets/errors/ServerError";

export class FechaConfiguracion{

    constructor(){
        this._mainTable = `${process.env.DB_CITAS_SCHEMA}.fecha_configuracion`;
    }

    async fecha_configuraciones(){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows} = await SQL.query(`
            SELECT id,fecha,is_current FROM  ${this._mainTable}
            where deprecated=false 
            order by id desc
            `);
            return rows;
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async fecha_configuraciones2(){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows} = await SQL.query(`
            SELECT id,fecha,is_current FROM  ${this._mainTable}
            where deprecated=false 
            `);
            return rows;
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async findFecha(){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows} = await SQL.query(`
            SELECT fecha FROM  ${this._mainTable}
            where deprecated=false 
            and is_current=true
            order by id desc`);
            return rows[0]
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async ultimo(){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows} = await SQL.query(`
            SELECT id FROM  ${this._mainTable}
            where deprecated=false
            and is_current =true
            order by id desc`);
            return rows[0]
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async fechaConfiguracion(fecha_configuracion){
        let SQL;
        try {
            SQL = await CitasDb.getPoolConnection();
            SQL.query('BEGIN');
            let  {rows}= await SQL.query(`
            INSERT INTO ${this._mainTable}
            (fecha) VALUES($1) RETURNING * ;
            `,[fecha_configuracion])
            await SQL.query('COMMIT');
            return rows[0];
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async desactiva(id){
        let SQL;
        try {
            SQL = await CitasDb.getPoolConnection();
            SQL.query('BEGIN');
            let  {rows}= await SQL.query(`
            UPDATE ${this._mainTable}
            SET is_current=false,updated_at=now()
            WHERE id=$1;
            `,[id])
            await SQL.query('COMMIT');
            return rows[0]? true:false;
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async desactivaDepreca(id){
        let SQL;
        try {
            SQL = await CitasDb.getPoolConnection();
            SQL.query('BEGIN');
            let  {rows}= await SQL.query(`
            UPDATE ${this._mainTable}
            SET is_current=false,deprecated=true,updated_at=now()
            WHERE id=$1;
            `,[id])
            await SQL.query('COMMIT');
            return rows[0]? true:false;
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async activa(id){
        let SQL;
        try {
            SQL = await CitasDb.getPoolConnection();
            SQL.query('BEGIN');
            let  {rows}= await SQL.query(`
            UPDATE ${this._mainTable}
            SET is_current=true,deprecated=false,updated_at=now()
            WHERE id=$1;
            `,[id])
            await SQL.query('COMMIT');
            return rows[0]? true:false;
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    
    async fecha(fecha){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows} = await SQL.query(`
            SELECT id,fecha,is_current,deprecated FROM  ${this._mainTable}
            where fecha=$1
            `,[fecha]);
            return rows[0];
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }
    async actual(){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows} = await SQL.query(`
            SELECT id,fecha,is_current,deprecated FROM  ${this._mainTable}
            where is_current=true
            `);
            return rows[0];
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }
}