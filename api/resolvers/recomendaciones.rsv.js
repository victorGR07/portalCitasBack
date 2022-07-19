import { RecomendacionesModel } from "../models/recomendaciones"
import logRsv from "./log.rsv";

const RECOMENDACIONES = new RecomendacionesModel();
export default{
    Query:{
        recomendacionPersonalizado:async (root,args)=>{
            return await  RECOMENDACIONES.recomendacionPersonalizado(args);
        },

        recomendacionPersonalizadoGeneral:async (root,args)=>{
          return await  RECOMENDACIONES.recomendacionPersonalizadoGen(args);
      }
    },

    Mutation:{
        recomendacion:async (root,args,context)=>{
            args.recomendacion=args.recomendacion.trim().toUpperCase();
            let b=await  RECOMENDACIONES.recomendacionPersonalizadoGeneral({recomendacion:args.recomendacion});
            if(b[0]==null){
                let x= await RECOMENDACIONES.createElement(args);
                logRsv.Mutation.log(
                    undefined,
                    {
                      id_usuario: args.id_usuario,
                      descripcion: `Se creo una recomendacion`,
                      operacion: {"entity": "recomendaciones", "command": "updated", "transaction_id":x.id}
                    },
                    context
                  );
                  return x;
            }else{
                if(b[0].deprecated==false && b[0].deprecated==true){
                    return b[0];
                }else if (b[0].deprecated==true || b[0].deprecated==false){
                    logRsv.Mutation.log(
                        undefined,
                        {
                          id_usuario: args.id_usuario,
                          descripcion: `Se activo la recomendacion`,
                          operacion: {"entity": "recomendaciones", "command": "updated", "transaction_id":b[0].id}
                        },
                        context
                      );
                  return await RECOMENDACIONES.activoRecomendacion({id:b[0].id});
                }
            }
        },

        bajaRecomendacion:async (root,args,context)=>{
            logRsv.Mutation.log(
                undefined,
                {
                  id_usuario: args.id_usuario,
                  descripcion: `Se dio de baja la recomendacion`,
                  operacion: {"entity": "recomendaciones", "command": "updated", "transaction_id":args.id}
                },
                context
              );
            return await RECOMENDACIONES.bajaRecomendacion(args);
        },

        altaRecomendacion:async (root,args,context)=>{
          logRsv.Mutation.log(
              undefined,
              {
                id_usuario: args.id_usuario,
                descripcion: `Se dio de alta la recomendacion`,
                operacion: {"entity": "recomendaciones", "command": "updated", "transaction_id":args.id}
              },
              context
            );
          return await RECOMENDACIONES.altaRecomendacion(args);
      },

        ordenamientoRecomendaciones: async(root,args,context)=>{
          for (let index = 0; index < args.ordenamiento.length; index++) {
            await RECOMENDACIONES.updateOrdenamientoRecomendaciones(+args.ordenamiento[index].id,args.ordenamiento[index].ordenamiento)     
           }
           return true;
        }

    }
}