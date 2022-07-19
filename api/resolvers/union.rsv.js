import moment from 'moment';
import { Union } from '../models/Union';
import tramiteRsv from './tramite.rsv';
import logRsv from './log.rsv';


export default {
    Query: {
        unionByTramite: async (root, args) => {
            return await Union.getElementsByDeptoModulo(args);
        },

        unionById:async(root,args)=>{
            return await Union.getElementsById(args);
        },
        diasEspecialesByTramite: async (_, args) => {
            let res= await Union.getSpecialDaysByDeptoModulo(args);
            return res;
        }
    },
    Mutation: {
        union: async (root, args, context) => {
            let [union] = await Union.createElement(args);
            logRsv.Mutation.log(
                undefined,
                {
                    id_usuario: args.id_usuario,
                    descripcion: 'Se creó una unión',
                    operacion: {"entity": "union_tramites_configuracion", "command": "created", "transaction_id":union.id}
                },
                context
            );
            return union;
        },
        setConfiguracion: async (root, args, context) => {
            let viejo= await Union.getElementsByGeneral();
           let [union] = await Union.updateConfiguracion(args);
            logRsv.Mutation.log(
                undefined,
                {
                    id_usuario: args.id_usuario,
                    descripcion: 'Actualizó configuración de la unión',
                    operacion: {"entity": "union_tramites_configuracion", "command": "updated","value":viejo.configuracion}
                },
                context
            );
            return union;
        },
        setDiasEspeciales: async (_, { id_tramite,id_usuario, dias },context) => {
                let unions = await Union.getElementsByDeptoModulo({id_tramite:id_tramite}); 
                for (let { id, configuracion } of unions) {
                    let diasEspeciales = [];
                    if (
                        configuracion.dias_especiales &&
                        configuracion.dias_especiales.length > 0
                    ) {
                        diasEspeciales = configuracion.dias_especiales;
                    }

                    let diaMoment;
                    for (const DIA of dias) {
                        diaMoment = moment(DIA.fecha, ['YYYY-MM-DD','YYYY/MM/DD' ]).format('YYYY-MM-DD');

                        DIA.fecha = diaMoment;

                        let vMoment;
                        let diaRepetido = diasEspeciales.findIndex(v => {
                            vMoment = moment(v.fecha, [
                                'YYYY-MM-DD',
                                'YYYY/MM/DD'
                            ]).format('YYYY-MM-DD');
                            return vMoment == DIA.fecha;
                        });
                        if (diaRepetido !== -1)
                            diasEspeciales.splice(diaRepetido, 1);
                        diasEspeciales.push({ ...DIA });
                    }

                    configuracion.dias_especiales = diasEspeciales.sort(
                        (a, b) => {
                            if (a.fecha > b.fecha) {
                                return 1;
                            }
                            if (a.fecha < b.fecha) {
                                return -1;
                            }
                            return 0;
                        }
                    );

                    logRsv.Mutation.log(
                        undefined,
                        {
                            id_usuario: id_usuario,
                            descripcion: 'Se agrego dias especiales',
                            operacion: {"entity": "union_tramites_configuracion", "command": "updated", "transaction_id":id,"value":configuracion.dias_especiales}
                        },
                        context
                      );

                    await Union.updateConfiguracion({id: id,configuracion: configuracion});
                }
            
            return true;
        },
        deleteDiasEspeciales: async (_, { id_tramite,id_usuario, dias },context) => {

                let unions = await Union.getElementsByDeptoModulo({id_tramite:id_tramite});

                for (let { id, configuracion } of unions) {
                    let diasEspeciales = configuracion.dias_especiales;
                    if (!diasEspeciales || diasEspeciales.length == 0)
                        return true;

                    let diaMoment;
                    for (const DIA of dias) {
                        diaMoment = moment(DIA, ['YYYY-MM-DD','YYYY/MM/DD']).format('YYYY-MM-DD');

                        let vMoment;
                        let diaEncontrado = diasEspeciales.findIndex(v => {
                            vMoment = moment(v.fecha, ['YYYY-MM-DD','YYYY/MM/DD']).format('YYYY-MM-DD');

                            return vMoment == diaMoment;
                        });
                        if (diaEncontrado !== -1)
                            diasEspeciales.splice(diaEncontrado, 1);
                    }

                    configuracion.dias_especiales = diasEspeciales.sort(
                        (a, b) => {
                            if (a.fecha > b.fecha) {
                                return 1;
                            }
                            if (a.fecha < b.fecha) {
                                return -1;
                            }
                            return 0;
                        }
                    );

                    logRsv.Mutation.log(
                        undefined,
                        {
                            id_usuario: id_usuario,
                            descripcion: 'Se elemino dias especiales',
                            operacion: {"entity": "union_tramites_configuracion", "command": "deleted", "transaction_id":id,"value":dias}
                        },
                        context
                      );

                    await Union.updateConfiguracion({id: id,configuracion: configuracion});
                }
            
            return true;
        },
    },
    Union: {
        
        tramite: async root => {
            return await tramiteRsv.Query.tramite(undefined, {
                id: root.id_tramite
            });
        },
        tramiteGeneral: async root => {
            return await tramiteRsv.Query.tramiteGeneral(undefined, {
                id: root.id_tramite
            });
        },

    }

};
