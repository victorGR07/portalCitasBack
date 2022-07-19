import { CitasDb } from '../assets/db/CitasDb';
import { ServerError } from '../assets/errors/ServerError';
import {
    _bf_getElementsByDeptoModulo,
    _bf_createElement,
    _bf_updateConfiguracion
} from '../inspects/union';

export class Union {
    constructor() {}

    static async getElementsByDeptoModulo(payload) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT * 
                    FROM ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion 
                    WHERE deprecated = FALSE
                    AND id_tramite=$1;`,
                [payload.id_tramite]
            );
            return rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    static async getElementsById(payload) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT * 
                    FROM ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion 
                    WHERE deprecated = FALSE
                    AND id=$1;`,
                [payload.id]
            );
            return rows[0];
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    static async getElementsByGeneral() {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT * 
                    FROM ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion 
                    WHERE deprecated = FALSE;`   );
            return rows[0];
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    static async getSpecialDaysByDeptoModulo(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let {
                rows
            } = await SQL.query(
                `SELECT t.id,t.nombre,json_agg(json_build_object('id',t.id,'nombre',t.nombre) order by t.id asc) tramites,umdt.configuracion -> 'dias_especiales' dias_especiales FROM ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion umdt 
                JOIN ${process.env.DB_CITAS_SCHEMA}.tramites t ON t.id = umdt.id_tramite 
                WHERE umdt.deprecated = false AND  umdt.id_tramite =$1
                GROUP BY t.id,t.nombre,umdt.configuracion -> 'dias_especiales' ORDER BY t.id ASC;`,
                [data.id_tramite]
            );
            return rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    static async findByModuloDptoTramite(payload) {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `
        SELECT * FROM ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion
        WHERE id_tramite = $1
        AND deprecated = false;`;
            let result = await client.query(query, [payload.id_tramite]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }

    static async findByDptoTramite(payload) {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `
        SELECT  id_modulo,nombre,m.id_modulo_servicio ,umdt.configuracion FROM ${process.env.DB_CITAS_SCHEMA}.UNION_MODULOS_DEPARTAMENTOS_TRAMITES umdt
        inner join ${process.env.DB_CITAS_SCHEMA}.modulos m on umdt.id_modulo= m.id 
        WHERE id_tramite = $1
        AND id_departamento = $2
        AND  umdt.deprecated = false
        order by id_modulo  asc;`;
            let result = await client.query(query, [
                payload.id_tramite,
                payload.id_departamento,
            ]);
           return result.rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }

    static async findByDptoTramiteIdModulo( id_tramite,id_departamento,id_modulo) {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `
        SELECT  id_modulo,m.id_modulo_servicio ,umdt.configuracion FROM ${process.env.DB_CITAS_SCHEMA}.UNION_MODULOS_DEPARTAMENTOS_TRAMITES umdt
        inner join ${process.env.DB_CITAS_SCHEMA}.modulos m on umdt.id_modulo= m.id 
        WHERE id_tramite = $1
        AND id_departamento = $2
        AND  umdt.deprecated = false
        and id_modulo =$3
        order by id_modulo  asc;`;
            let result = await client.query(query, [
                id_tramite,
                id_departamento,
                id_modulo
            ]);
           return result.rows[0];
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }


    static async createElement(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `INSERT INTO ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion (id_tramite,configuracion) 
                    VALUES ($1,$2) 
                    RETURNING *;`,
                [data.id_tramite,data.configuracion]
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

    static async updateConfiguracion(data) {
        let { configuracion } = _bf_updateConfiguracion(data);
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion 
                    SET configuracion = $1,
                    updated_at = NOW()
                    WHERE deprecated=false 
                    RETURNING *;`,
                [configuracion]
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
