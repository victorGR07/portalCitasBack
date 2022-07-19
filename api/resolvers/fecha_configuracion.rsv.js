import { FechaConfiguracion } from "../models/fecha_configuracion"
import logRsv from "./log.rsv";

const FECHACONFIGURACION= new FechaConfiguracion();

export default{
    Query:{
        fecha_configuracion: async(_,args)=>{
           return await FECHACONFIGURACION.findFecha();
        },

        fecha_configuraciones: async(_,args)=>{
            return await FECHACONFIGURACION.fecha_configuraciones();
        }
    },

    Mutation:{
        crearfecha_configuracion:async (_,args,context)=>{
            let  busu=await FECHACONFIGURACION.fecha(args.fecha_configuracion)
    
            if(busu==null){
                let x=await FECHACONFIGURACION.actual();
                if(x!=null) {await FECHACONFIGURACION.desactiva(x.id);}
                let xd=await FECHACONFIGURACION.fechaConfiguracion(args.fecha_configuracion);
                logRsv.Mutation.log(
                    undefined,
                    {
                      id_usuario: args.id_usuario,
                      descripcion: 'Se agrego fecha de configuracion',
                      operacion: {"entity": "fecha_configuracion", "command": "created", "transaction_id":xd.id}
                    }, 
                    context
                  );
                  return true;
            }else{
                if(busu.is_current==true)return true;

                let x=await FECHACONFIGURACION.actual();
                if(x!=null) {await FECHACONFIGURACION.desactiva(x.id);}
                await FECHACONFIGURACION.activa(busu.id);
                logRsv.Mutation.log(
                    undefined,
                    {
                      id_usuario: args.id_usuario,
                      descripcion: 'Se activo fecha de configuracion',
                      operacion: {"entity": "fecha_configuracion", "command": "activacion", "transaction_id":busu.id}
                    },
                    context
                  );
                  return true;
            }

        },

        cancelarfechafecha_configuracion:async(_,args,context)=>{
            let x= await FECHACONFIGURACION.fecha_configuraciones2();
           if(x!=null   && (x.length-2)>=0 ) await FECHACONFIGURACION.activa(x[x.length-2].id);
            await FECHACONFIGURACION.desactivaDepreca(args.id);
            logRsv.Mutation.log(
                undefined,
                {
                  id_usuario: args.id_usuario,
                  descripcion: `Se desactivo una fecha de configuracion: ${args.id}`,
                  operacion: {"entity": "fecha_configuracion", "command": "cancelacion", "transaction_id":args.id}
                },
                context
              );
                return true;
        }
    }
}