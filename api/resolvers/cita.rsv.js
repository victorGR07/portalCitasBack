import { Cita } from '../models/Cita';
import tramiteRsv from './tramite.rsv';
import { sendMail, sendMailNotificaion} from '../helpers/email';
import logRsv from './log.rsv';


import unionRsv from './union.rsv';
import usuariosRsv from './usuarios.rsv';
import { ServerError } from '../assets/errors/ServerError';
import recomendacionesRsv from './recomendaciones.rsv';
import estadosRsv from './estados.rsv';


const CITA = new Cita();

export default {
  Query: {
    cita: async (root, args) => {
      let [cita] = await CITA.getElementById(args);
      return cita;
    },
    citas: async (root, args) => {
      return await CITA.getElements();
    },
    citasByTramite: async (root, args) => {
      return await CITA.getElementsByDeptoTramiteModulo(args);
    },
    canMakeCita: async (_, args) => {
      let x=await CITA.getDatesCountByRfcFecha(args);
      if(x){
        return await CITA.getDatesCountByRfc(args);
      }else{
        return x;
      }
      
    },
    citaPersonalizada:async(_,args)=>{
      return await CITA.citaPersonalizada(args);
    },
    reportesCitas:async(_,args)=>{
      if(args.id_usuario==null){
        return await CITA.reportesCitas(args);
      }else{
        return await CITA.reportesCitasUsuario(args);
      }

    }

  },
  Mutation: {
    cita: async (root, args) => {
      let rfcDia=await CITA.getDatesCountByRfcFecha(args);
        if(rfcDia){
            let rfcGeneral =await CITA.getDatesCountByRfc(args);

                if(!rfcGeneral)        throw new ServerError(new Error('Ya cuenta con una cita agendada'));
          }else{
            throw new ServerError(new Error('Ya cuenta con una cita agendada'));
        }



      let x= await CITA.getFolioGeneral();
      let xx = await CITA.getFolioDia(args.fecha)
      args.folio_general=parseInt(x)+1;
      args.folio_dia=parseInt(xx)+1
      let [cita] = await CITA.createElement(args);

      /* Envío de correo */
      if (cita.email) {

    let unio=await unionRsv.Query.unionById(undefined,{id:cita.id_union_tramites_configuracion});
    let {nombre: tramite_query,requisitos: requisitos_query} = await tramiteRsv.Query.tramite(undefined, {id: unio.id_tramite});
    let recomendaciones= await recomendacionesRsv.Query.recomendacionPersonalizado(undefined,{});
    let xd

    if(requisitos_query.requisitos!=null){
      xd=requisitos_query.requisitos.sort(((a, b) => a.ordenamiento - b.ordenamiento))
    }else{
      xd=requisitos_query
    }
        let argsEmail = {
          id: cita.folio_general,
          nombre: cita.nombre,
          primer_apellido: cita.primer_apellido,
          segundo_apellido: cita.segundo_apellido,
          razon_social:cita.razon_social,
          email: cita.email,
          fecha: cita.fecha,
          hora: cita.hora,
          tramite: tramite_query.toUpperCase(), 
          requisitos: xd,
          rfc:cita.rfc,
          tipo_persona:cita.tipo_persona,
          id_dia:cita.folio_dia,
          recomendaciones:recomendaciones

        };

          await sendMail(argsEmail);
      }
     return cita;

    },
    setAtendido: async (root, args, context) => {
      let [cita_update] = await CITA.updateAtendido(args);
      let [cita] = await CITA.getElementById({ id: cita_update.id });
      logRsv.Mutation.log(
        undefined,
        {
          id_usuario: args.id_usuario,
          descripcion: `La cita se atendio`,
          operacion: {"entity": "citas", "command": "updated", "transaction_id":cita_update.id}
        },
        context
      );
      return cita;
    },
    setObservacion: async (root, args, context) => {
      let [cita_update] = await CITA.updateObservacion(args);
      let [cita] = await CITA.getElementById({ id: cita_update.id });
      logRsv.Mutation.log(
        undefined,
        {
          id_usuario: args.id_usuario,
          descripcion: `Actualizó observación a la cita`,
          operacion: {"entity": "citas", "command": "updated", "transaction_id":cita_update.id}
        },
        context
      );
      return cita;
    },
    setDocumentacion: async (root, args, context) => {
      logRsv.Mutation.log(
        undefined,
        {
          id_usuario: args.id_usuario,
          descripcion: `Actualizó documentacion a la cita`,
          operacion: {"entity": "citas", "command": "updated", "transaction_id":args.id}
        },
        context
      );
      return await CITA.setDocumentacion(args);
    },



    notificacionCitas:async(root,args,context)=>{
      let citas=await CITA.citaPersonalizada({fecha:args.fecha});
      let id_citas=[];
      for (let index = 0; index < citas.length; index++) {
        id_citas.push(citas[index].id)
        let msg = {
          nombre: citas[index].nombre,
          primer_apellido: citas[index].primer_apellido,
          segundo_apellido: citas[index].segundo_apellido,
          razon_social:citas[index].razon_social,
          email:citas[index].email,
          mensaje:args.mensaje
        };
       await sendMailNotificaion(msg);
      }
      logRsv.Mutation.log(
        undefined,
        {
          id_usuario: args.id_usuario,
          descripcion: `Se hizo una notificación`,
          operacion: {"entity": "citas", "command": "notificacion",
           "mensaje":args.mensaje,"id_citas":id_citas,"fecha":args.fecha}
        },
        context
      ); return true;
    },
    
 

    ordenamiento: async (_,args)=>{
      for (let index = 0; index < args.ordenamiento.length; index++) {
        await CITA.updateOrdenamientoTramites(+args.ordenamiento[index].id,args.ordenamiento[index].ordenamiento)     
       }
  },

  setEstadoCita: async (_,args,context)=>{
    let x= await CITA.setEstadoCita(args);
    logRsv.Mutation.log(
      undefined,
      {
        id_usuario: args.id_usuario,
        descripcion: `Se cambio de estado la cita`,
        operacion: {"entity": "citas", "command": "updated","id_citas":args.id}
      },
      context
    ); return x[0];
  }

  },
  Cita: {
    tramite_confirmacion: async root => {
     return await tramiteRsv.Query.tramite(undefined, { id: root.id_tramite_confirmacion });
    },
    tramite_confirmacionGeneral: async root => {
      return await tramiteRsv.Query.tramiteGeneral(undefined, { id: root.id_tramite_confirmacion });
     },
    
    union_tramite_configuracion:async root=> {
      return await unionRsv.Query.unionById(undefined,{id:root.id_union_tramites_configuracion});
    },

    usuario:async root=>{
      if(root.id_usuario!=null){
        let x= await usuariosRsv.Query.usuarioPersonalizado(undefined,{id:root.id_usuario});
        return x[0];
      }
      return null
    },

    estado:async root=>{
      let x= await estadosRsv.Query.estadosPersonalizados(undefined,{id:root.id_estado});
      return x[0]
    }
  }
};
