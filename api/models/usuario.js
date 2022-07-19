import { CitasDb } from "../assets/db/CitasDb";
import { ServerError } from "../assets/errors/ServerError";

export class UsuarioModel{
    constructor(){
        this._mainTable = `${process.env.DB_CITAS_SCHEMA}.usuarios`;
       }

     async usuarioPersonalizado(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let  {rows}= await SQL.query(`
            SELECT * FROM ${this._mainTable} WHERE deprecated = false
            AND (id=$1 OR $1 is null)
            AND (correo=$2 OR $2 is null)
            AND (clave_privada=$3 OR $3 is null)
            AND(curp=$4 OR $4 is null)
            AND(nombre=$5 OR $5 is null)
            AND(primer_apellido=$6 OR $6 is null)
            AND(segundo_apellido=$7 OR $7 is null)
            AND(id_rol=$8 OR $8 is null)
            `,[payload.id,
                payload.correo==null?payload.correo:payload.correo.trim(),
                payload.clave_privada==null?payload.clave_privada:payload.clave_privada.trim(),
                payload.curp==null?payload.curp:payload.curp.toUpperCase().trim(),
                payload.nombre==null?payload.nombre:payload.nombre.toUpperCase().trim(),
                payload.primer_apellido==null?payload.primer_apellido:payload.primer_apellido.toUpperCase().trim(),
                payload.segundo_apellido==null?payload.segundo_apellido:payload.segundo_apellido.toUpperCase().trim(),
                payload.id_rol
            ])
            return rows;
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }


    async cantidadPersonal(){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows}= await SQL.query(`
            select count(*) from ${this._mainTable} u 
            where  deprecated =false 
            and estatus=true 
            and id_rol =2;
            `);
            return rows[0];
        } catch (error) {
            throw new ServerError(error)
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    static async cantidadPersonal2(){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            let {rows}= await SQL.query(`
            select count(*) from ${process.env.DB_CITAS_SCHEMA}.usuarios u 
            where  deprecated =false 
            and estatus=true 
            and id_rol =2;`);

            return rows[0].count;
        } catch (error) {
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    
     async deletedUsuario(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');

            let  {rows}= await SQL.query(`
            UPDATE ${this._mainTable} 
            SET estatus=false,updated_at=now()
            WHERE id=$1 AND estatus=true RETURNING *
            `,[payload.id]);
            await SQL.query('COMMIT');
            return rows[0]?true:false;
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

     async updatedUsuario(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');

            let  {rows}= await SQL.query(`
            UPDATE ${this._mainTable} 
            SET id_rol=$2, nombre=$3, primer_apellido=$4, segundo_apellido=$5, correo=$6, clave_privada=$7, "curp"=$8, updated_at=now()
            WHERE id=$1
            RETURNING *
            `,[payload.id,payload.id_rol,payload.nombre,payload.primer_apellido,payload.segundo_apellido,payload.correo,payload.clave_privada,payload.curp]);
            await SQL.query('COMMIT');
            return rows[0];
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

     async createdUsuario(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');

            let  {rows}= await SQL.query(`
            INSERT INTO ${this._mainTable} 
            (id_rol, nombre, primer_apellido, segundo_apellido, correo, clave_privada,curp)
            VALUES($1,$2,$3,$4,$5,$6,$7) RETURNING *;
            `,[payload.id_rol,
                payload.nombre,
                payload.primer_apellido,
                payload.segundo_apellido,
                payload.correo,
                payload.clave_privada,
                payload.curp
                ]);
            await SQL.query('COMMIT');
            return rows[0];
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async activo_desactivoUsuario(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');

            let  {rows}= await SQL.query(`
            UPDATE ${this._mainTable} 
            SET estatus=$2,updated_at=now() where id=$1  RETURNING *;
            `,[payload.id,payload.valor
                ]);
            await SQL.query('COMMIT');
            return rows[0];
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

    async bloqueo_desbloqueoUsuario(payload){
        let SQL;
        try {
            SQL= await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');

            let  {rows}= await SQL.query(`
            UPDATE ${this._mainTable} 
            SET bloqueado=$2, updated_at=now() where id=$1 RETURNING *;
            `,[payload.id,payload.valor
                ]);
            await SQL.query('COMMIT');
            return rows[0];
        } catch (error) {
            await SQL.query('ROLLBACK');
            throw new ServerError(error);
        }finally{
            CitasDb.closePoolConnection(SQL);
        }
    }

}