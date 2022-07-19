import moment from 'moment-timezone';

import { CitasDb } from '../assets/db/CitasDb';
import { Tramite } from './tramite';
import { Union } from './Union';
import { Dia } from './dia';
import { ServerError } from '../assets/errors/ServerError';
import { ValidationError } from '../assets/errors/ValidationError';

import {
    _bf_getElementById,
    _bf_getElementsByDeptoTramiteModulo,
    _bf_createElement,
    _bf_updateAtendido,
    _bf_updateObservacion,
    _bf_getElementsByDates,
    _bf_updateDeprecated,
    _bf_getDatesCountByFullNameOrEmail
} from '../inspects/cita';

import { _getDay } from '../helpers/cita.hlp';
import { _getConfig } from '../helpers/tramite.hlp';
import usuariosRsv from '../resolvers/usuarios.rsv';

const DIA = new Dia();

export class Cita {
    constructor() {
        this._mainTable = `${process.env.DB_CITAS_SCHEMA}.citas`;
        this._unionModulosDepartamentosTramitesTable = `${process.env.DB_CITAS_SCHEMA}.union_tramites_configuracion`;
        this._tramitesTable = `${process.env.DB_CITAS_SCHEMA}.tramites`;
        this._logs = `${process.env.DB_CITAS_SCHEMA}.logs`;
    }

    async getElementById(data) {
        let { id } = _bf_getElementById(data);
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT c.*,
                    t.id id_tramite 
                    FROM ${this._mainTable} c 
                    JOIN ${this._unionModulosDepartamentosTramitesTable} umdt ON umdt.id = c.id_union_tramites_configuracion 
                    JOIN ${this._tramitesTable} t ON t.id = umdt.id_tramite  
                    WHERE c.id = $1
                    AND c.deprecated=false
                    AND t.deprecated = FALSE 
                    LIMIT 1;`,
                [id]
            );
            return rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async citaPersonalizada(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT * FROM ${this._mainTable} c 
                left join ( select l.id_usuario,l.operacion from ${this._logs} l where l.descripcion='La cita se atendio')as l on c.id =(l.operacion->>'transaction_id')::int
                WHERE deprecated=false
                and ( id = $1 or $1 is null)
                and ( folio_general = $2 or $2 is null)
                and ( folio_dia = $3 or $3 is null)
                and ( rfc = $4 or $4 is null)
                and ( email = $5 or $5 is null)
                and ( fecha = $6 or $6 is null)
                and ( hora = $7 or $7 is null)
                and ( id_estado = $8 or $8 is null);`,
                [data.id,data.folio_general,data.folio_dia,
                    data.rfc,data.email,data.fecha,data.hora,
                data.id_estado]
            );
            return rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async reportesCitas(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `select *,
                (select id_usuario from ${this._logs} l 
                    where t.id =(l.operacion->>'transaction_id')::int  and (l.descripcion ='Marcó la cita como atendida' or l.descripcion='Canceló la cita' or l.descripcion='La cita se atendio')  ) as id_usuario 
                from 
                (SELECT c.*
                 FROM ${this._mainTable} c 
                inner join ${this._unionModulosDepartamentosTramitesTable} utc on c.id_union_tramites_configuracion=utc.id 
                inner join ${this._tramitesTable } t on t.id =utc.id_tramite 
                WHERE c.deprecated=false
                and utc.deprecated =false 
                and t.deprecated =false 
                and fecha>=$1 and fecha<=$2
                and (tipo_persona=$3 or $3 is null)
                and (id_tramite=$4 or $4 is null)
                and (id_estado=$5 or $5 is null)
                )as t
                order by id;
                ;`,
                [data.fecha_inicio,data.fecha_fin,data.tipo_persona,data.id_tramite,data.id_estado]
            );
            return rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async reportesCitasUsuario(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT c.*,l.id_usuario FROM ${this._mainTable} c 
                inner join ${this._unionModulosDepartamentosTramitesTable} utc on c.id_union_tramites_configuracion=utc.id 
                inner join ${this._tramitesTable } t on t.id =utc.id_tramite 
                inner join ${this._logs} l on c.id =(l.operacion->>'transaction_id')::int
                WHERE c.deprecated=false
                and utc.deprecated =false 
                and t.deprecated =false 
                and fecha>=$1 and fecha<=$2
                and (tipo_persona=$3 or $3 is null)
                and (id_tramite=$4 or $4 is null)
                and (l.descripcion ='Marcó la cita como atendida' or l.descripcion='Canceló la cita' or l.descripcion='La cita se atendio')
                and l.id_usuario =$5
                and (id_estado=$6 or $6 is null)
                order by id;
                ;`,
                [data.fecha_inicio,data.fecha_fin,data.tipo_persona,data.id_tramite,data.id_usuario,data.id_estado]
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
                `SELECT c.*,
                    t.id id_tramite 
                    FROM ${this._mainTable} c 
                    JOIN ${this._unionModulosDepartamentosTramitesTable} umdt ON umdt.id = c.id_union_tramites_configuracion 
                    JOIN ${this._tramitesTable} t ON t.id = umdt.id_tramite  
                    WHERE c.deprecated = FALSE 
                    AND umdt.deprecated = FALSE 
                    AND t.deprecated = FALSE;`
            );
            return rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }


    async getFolioGeneral() {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT count(*) FROM ${this._mainTable} c 
                    where deprecated = FALSE;`
            );
            return rows[0].count;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async getFolioDia(fecha) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT count(*) FROM ${this._mainTable} c 
                    WHERE deprecated=false  AND fecha =$1;`,[fecha]);
            return rows[0].count;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async getElementsByDeptoTramiteModulo(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            let { rows } = await SQL.query(
                `SELECT c.*,
                    t.id id_tramite 
                    FROM ${this._mainTable} c 
                    JOIN ${this._unionModulosDepartamentosTramitesTable} umdt ON umdt.id = c.id_union_tramites_configuracion 
                    JOIN ${this._tramitesTable} t ON t.id = umdt.id_tramite  
                    WHERE c.deprecated = FALSE 
                    AND umdt.deprecated = FALSE 
                    AND t.deprecated = FALSE 
                    AND t.id = $1;`,
                [data.id_tramite]
            );
            return rows;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async createElement(data) {
        let { fecha, hora } = data;
        let now, fecha_moment, hora_moment;
        try {
            now = moment().tz('America/Mexico_City').format('YYYY-MM-DD');

            fecha_moment = moment(fecha, ['YYYY/MM/DD', 'YYYY-MM-DD']).tz('America/Mexico_City').format('YYYY-MM-DD');

            hora_moment = moment(`${fecha}${hora}`, ['YYYY/MM/DDTHH:mm','YYYY-MM-DDTHH:mm']).tz('America/Mexico_City').format(`HH:mm`);

        } catch (e) {
            throw new ValidationError(e);
        }

        let sistema = moment(now).tz('America/Mexico_City');
        let enviada = moment(fecha_moment).tz('America/Mexico_City');
        let diff_days = enviada.diff(sistema, 'days');

        if (diff_days < 1) {
            throw new ValidationError(new Error('Fecha cita incorrecta'));
        }

        for (let tmp of await DIA.getElements()) {
            if (moment(fecha_moment).tz('America/Mexico_City').format('YYYY/MM/DD') == tmp.fecha) {
                throw new ValidationError(new Error('Fecha inhabilitada'));
            }
        }

        let dia_semana = moment(fecha_moment).isoWeekday();

        let un= await Union.getElementsById({id:data.union_tramite_configuracion});
        let union = await Union.findByModuloDptoTramite(un);
        let {dias,dias_especiales = null} = union.configuracion;
        let total_personal= await usuariosRsv.Query.cantidadPersonal(undefined); 
        let haveDiaEspecial = false;
        let haveDiaNormal = false;
        let configDiaNormal = null;
        let configDiaEspecial = null;

        if (!haveDiaEspecial && dias_especiales && dias_especiales.length > 0) {
            for (let dia of dias_especiales) {
                if (
                    moment(dia.fecha, ['YYYY-MM-DD', 'YYYY/MM/DD']).format(
                        'YYYY-MM-DD'
                    ) == fecha
                ) {
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
            throw new ValidationError(new Error('Día sin horarios disponibles para citas'));
        } else {
            let { inicio: inicio_config, fin: fin_config } = _getConfig(configDiaNormal,configDiaEspecial);

            let time = moment(hora, 'HH:mm');
            let inicio = moment(inicio_config, 'HH:mm').tz('America/Mexico_City');
            let fin = moment(fin_config, 'HH:mm').tz('America/Mexico_City');

            if (isNaN(time.diff(inicio, 'minutes')) || isNaN(time.diff(fin, 'minutes'))) {
                throw new ValidationError(new Error('Fecha u hora invalida'));
            }

            if (time.diff(inicio, 'minutes') < 0 || time.diff(fin, 'minutes') > 0) {
                throw new ValidationError(new Error('Día inhabilitado u hora fuera de servicio'));
            }

            let counter_citas = await Tramite.findCountTotalCitas(data,hora_moment,fecha_moment);

            if (counter_citas >= total_personal) {
                throw new ValidationError(new Error('Capacidad limitada'));
            }

        }



        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `INSERT INTO ${this._mainTable}  
                (folio_general, folio_dia,nombre, primer_apellido, segundo_apellido, razon_social, 
                    tipo_persona, "rfc","telefono", email, fecha, hora, id_union_tramites_configuracion)
                VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) 
                RETURNING *;`,
                [
                data.folio_general,data.folio_dia,data.nombre,data.primer_apellido,data.segundo_apellido,
                data.razon_social,data.tipo_persona,data.rfc,data.telefono,data.email,
                data.fecha,data.hora,data.union_tramite_configuracion,
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

    async updateAtendido(data) {
        let { id } = _bf_updateAtendido(data);
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${this._mainTable} SET updated_at = NOW(),
                    id_tramite_confirmacion=$2
                    WHERE id = $1 
                    RETURNING *;`,
                [id,data.tramite_confirmacion]
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

    async updateObservacion(data) {
        let { id, observacion } = _bf_updateObservacion(data);
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${this._mainTable} SET observacion = $1, ` +
                    `updated_at = NOW() ` +
                    `WHERE id = $2 ` +
                    `RETURNING *;`,
                [observacion, id]
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
    async setDocumentacion(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${this._mainTable} SET documentacion = $1, 
                    updated_at = NOW() 
                    WHERE id = $2
                    RETURNING *;`,
                [data.documentacion, data.id]
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



    async updateDeprecated(data) {
        let { id } = _bf_updateDeprecated(data);
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${this._mainTable} SET cancelado = TRUE,
                    updated_at = NOW() 
                    WHERE id = $1 
                    RETURNING *;`,
                [id]
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


    async setEstadoCita(data) {
        const SQL = await CitasDb.getPoolConnection();
        try {
            SQL.query(`BEGIN`);
            let {
                rows
            } = await SQL.query(
                `UPDATE ${this._mainTable} SET id_estado = $2,
                    updated_at = NOW() 
                    WHERE id = $1 
                    RETURNING *;`,
                [data.id,data.id_estado]
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

    async getDatesCountByRfc(data) {
    
        const SQL = await CitasDb.getPoolConnection();
        try {
            let {
                rows
            } = await SQL.query(
                `SELECT COUNT(*) FROM ${this._mainTable}  c
                WHERE c."rfc"=$1
                    and id_estado=1
                    AND deprecated = FALSE;`,
                [data.rfc]
            );
            let [row] = rows;
            return row.count >= 1 ? false : true;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }

    async getDatesCountByRfcFecha(data) {
    
        const SQL = await CitasDb.getPoolConnection();
        try {
            let {
                rows
            } = await SQL.query(
                `SELECT COUNT(*) FROM ${this._mainTable}  c
                WHERE c."rfc"=$1
                    and fecha =$2
                    AND deprecated = FALSE;`,
                [data.rfc,data.fecha]
            );
            let [row] = rows;
            return row.count >= 1 ? false : true;
        } catch (e) {
            throw new ServerError(e);
        } finally {
            CitasDb.closePoolConnection(SQL);
        }
    }



     async updateOrdenamientoTramites(id,ordenamiento){
        let SQL;
        try {
            SQL = await CitasDb.getPoolConnection();
            await SQL.query('BEGIN');
            let {rows} = await SQL.query(`
            UPDATE ${this._tramitesTable}
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


     async updateStatus(data) {
         let SQL;
        try {
            SQL=await CitasDb.getPoolConnection();
            SQL.query(`BEGIN`);
            let {rows} = await SQL.query(` 
            UPDATE ${process.env.DB_CITAS_SCHEMA}.CITAS
            SET id_status=$2, updated_at=now()
            WHERE id=$1   RETURNING *;`,[data.id,data.id_status]);
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
