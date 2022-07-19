import { Log } from "../models/Log";

const LOG = new Log();

export default {
  Query: {
    log: async (root, args) => {
      let [log] = await LOG.getElementById(args);
      return log;
    },

    logNotificaciones:async(root,args)=>{
      return await LOG.getElementByNotificaion();
    }
  },
  Mutation: {
    log: async (root,payload,context) => {
  
      let [log] = await LOG.createElement({
        id_usuario: payload.id_usuario,
        descripcion: payload.descripcion,
        cliente:context.client,
        operacion: payload.operacion
      });
      return log;
    },


  }
};
