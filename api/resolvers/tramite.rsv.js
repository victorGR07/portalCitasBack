import { ServerError } from "../assets/errors/ServerError";
import { Tramite } from "../models/tramite";
import logRsv from "./log.rsv";


export default {
  Query: {
    tramites: async (root, args) => {
      let tramites = await Tramite.find();
      return tramites;
    },

    tramitesGeneral: async (root, args) => {
      let tramites = await Tramite.findGeneral();
      return tramites;
    },

    tramite: async (root, args) => {
      let tramite = await Tramite.findByID(args);
      return tramite;
    },
    tramiteGeneral: async (root, args) => {
      let tramite = await Tramite.findByIDGeneral(args);
      return tramite;
    },
  
    getFreeTimeByTramite: async (root, args) => {
      let hours = await Tramite.getFreeTime(args);
      return hours;
    }
  },
  Mutation: {
    tramite: async (root, { nombre, requisitos,descripcion, id_usuario}, context) => {
      let bus= await Tramite.findByNombre(nombre);
      if(bus!=null)  throw new ServerError(new Error('Ya existe el trámite'))
     let requisitos_json = JSON.stringify(requisitos);
      let [tramite] = await Tramite.createElement({nombre: nombre,requisitos: requisitos_json,descripcion:descripcion});


      logRsv.Mutation.log(
        undefined,
        {
          id_usuario: id_usuario,
          descripcion: 'Creó nuevo trámite',
          operacion: {"entity": "tramites", "command": "created", "transaction_id":tramite.id}
        },
        context
      );
      return tramite;
    },
    updateTramite: async (root, { id, nombre,descripcion,id_usuario }, context) => {
      let viejo=await Tramite.findByID({id:id});
      let [tramite] = await Tramite.updateElement({
        id: id,
        nombre: nombre,
        descripcion:descripcion
      });
      logRsv.Mutation.log(
        undefined,
        {
          id_usuario: id_usuario,
          descripcion: 'Actualizó trámite',
          operacion: {"entity": "tramites", "command": "updated", "transaction_id":tramite.id,"value":viejo}
        },
        context
      );
      return tramite;
    },

    updateEstatusTramite: async (root,arg,context)=>{
      let x= await Tramite.updateElementEstatus(arg);
      logRsv.Mutation.log(
        undefined,
        {
          id_usuario: arg.id_usuario,
          descripcion: 'Actualizó el campo estatus del trámite',
          operacion: {"entity": "tramites", "command": "updated", "transaction_id":arg.id,"value":arg.estatus}
        },
        context
      );
      return true;
    },

    updatedTramiteRequsitos:async(root,args,context)=>{
      let viejo=await Tramite.findByID({id:args.id});
      let x= await Tramite.updatedTramiteRequsitos(args);
       logRsv.Mutation.log(
        undefined,
        {
          id_usuario: args.id_usuario,
          descripcion: 'Actualizó el campo requisitos del trámite',
          operacion: {"entity": "tramites", "command": "updated", "transaction_id":x.id,"value":viejo.requisitos}
        },
        context
      );
      return x;
    }
  },
};
