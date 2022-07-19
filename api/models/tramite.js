import moment from 'moment';
moment.locale('es');

import { CitasDb } from '../assets/db/CitasDb';
import { ServerError } from '../assets/errors/ServerError';
import { Union } from './Union';
import { _bf_createElement, _bf_updateElement } from '../inspects/tramite';
import { _getConfig } from '../helpers/tramite.hlp';
import { UsuarioModel } from './usuario';

export class Tramite {
    constructor() {}

    static async find() {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `SELECT * FROM ${process.env.DB_CITAS_SCHEMA}.TRAMITES WHERE deprecated = false AND estatus=true ORDER BY ordenamiento ASC;`;
            let result = await client.query(query);
            return result.rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }

    static async findGeneral() {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `SELECT * FROM ${process.env.DB_CITAS_SCHEMA}.TRAMITES WHERE deprecated = false ORDER BY ordenamiento ASC;`;
            let result = await client.query(query);
            return result.rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }

    static async findByID(payload) {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `SELECT * FROM ${process.env.DB_CITAS_SCHEMA}.TRAMITES 
            WHERE id = $1 AND deprecated = false AND estatus=true;`;
            let result = await client.query(query, [payload.id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }

    static async findByIDGeneral(payload) {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `SELECT * FROM ${process.env.DB_CITAS_SCHEMA}.TRAMITES 
            WHERE id = $1 AND deprecated = false;`;
            let result = await client.query(query, [payload.id]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }

    static async findByNombre(nombre) {
        let client = await CitasDb.getPoolConnection();
        try {
            let query = `SELECT * FROM ${process.env.DB_CITAS_SCHEMA}.TRAMITES 
            WHERE nombre = $1 AND deprecated = false;`;
            let result = await client.query(query, [''+nombre]);
            return result.rows.length > 0 ? result.rows[0] : null;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }



    static async getFreeTime(payload) {
        let fecha = moment(payload.fecha, ['YYYY-MM-DD', 'YYYY/MM/DD']).format('YYYY-MM-DD');

        let dia_semana = moment(fecha).isoWeekday();

        let fecha_server = moment();

        if (fecha <= fecha_server.format('YYYY-MM-DD')) return [];

        let union = await Union.findByModuloDptoTramite(payload);

        if (!union) return [];

        let {
            total_personal,
            tiempo_cita,
            dias,
            dias_especiales = null
        } = union.configuracion;

        let haveDiaEspecial = false;
        let haveDiaNormal = false;
        let configDiaNormal = null;
        let configDiaEspecial = null;

        let tota=await UsuarioModel.cantidadPersonal2();
        total_personal=tota;

        if (total_personal==0) return [];

        if (!haveDiaEspecial && dias_especiales && dias_especiales.length > 0) {
            for (let dia of dias_especiales) {
                if (moment(dia.fecha, ['YYYY-MM-DD', 'YYYY/MM/DD']).format('YYYY-MM-DD') == fecha) {
                    haveDiaEspecial = true;
                    configDiaEspecial = dia;
                }
            }
        }

        if (!haveDiaNormal) {
            for (let dia of dias) {
                if (dia.dia_codigo == dia_semana && dia.permitido == true) {
                    haveDiaNormal = true;
                    configDiaNormal = dia;
                }
            }
        }

        if (!haveDiaNormal ||(haveDiaEspecial && !configDiaEspecial.permitido)) {
            return [];
        } else {
            let horarios = [];

            let { inicio, fin } = _getConfig(
                configDiaNormal,
                configDiaEspecial
            );

            while (inicio.diff(fin, 'minutes') <= 0) {
                let count = await this.findCountTotalCitas(payload,inicio.format('H:mm'),fecha);
                if (count < total_personal) {
                    horarios.push(inicio.format('H:mm'));
                }
                inicio.add(tiempo_cita, 'minutes').format('H:mm');
            }
    
            return horarios;
        }
    }


    static async findCountTotalCitas(payload, hora, fecha) {
        let client = await CitasDb.getPoolConnection();
        let queryCitas = `
      SELECT count(c.*) FROM ${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion u
      INNER JOIN ${process.env.DB_CITAS_SCHEMA}.citas c ON c.id_union_tramites_configuracion = u.id
      WHERE u.deprecated = false
      --u.id_tramite = $1
      AND c.deprecated = false
      AND c.hora = $1
      AND c.fecha = $2;
    `;

        try {
            let resultCitas = await client.query(queryCitas, [
                hora,
                fecha
            ]);
            let count =
                resultCitas.rows.length > 0 ? resultCitas.rows[0].count : 0;
            return count;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(client);
        }
    }

    static async createElement(data) {
        let { nombre, requisitos } = _bf_createElement(data);
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `INSERT INTO ${process.env.DB_CITAS_SCHEMA}.TRAMITES (nombre,requisitos,descripcion) 
                    VALUES ($1,$2,$3)
                    RETURNING *;`,
                [nombre, requisitos,data.descripcion]
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

    static async updateElement(data) {
        let { id, nombre } = _bf_updateElement(data);
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${process.env.DB_CITAS_SCHEMA}.TRAMITES
                   SET nombre = $1, descripcion=$3,
                   updated_at = NOW() 
                   WHERE id = $2 
                   RETURNING *;`,
                [nombre, id,data.descripcion]
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

    static async updateElementEstatus(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${process.env.DB_CITAS_SCHEMA}.TRAMITES 
                    SET estatus = $2
                    WHERE id = $1 
                    RETURNING *;`,
                [data.id,data.estatus]
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

    static async updatedTramiteRequsitos(data) {
        const SQL = await CitasDb.getPoolConnection();
        let xd={"requisitos":data.requisitos}
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${process.env.DB_CITAS_SCHEMA}.TRAMITES 
                    SET requisitos = $2,updated_at=now()
                    WHERE id = $1 
                    RETURNING *;`,
                [data.id,xd]
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

}
