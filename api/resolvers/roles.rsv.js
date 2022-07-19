import { RolesModel } from "../models/roles";
import logRsv from "./log.rsv";

const ROLES= new RolesModel();

export default{
   Query:{
    rolPersonalizado: async (_,args)=>{
        return await ROLES.rolPersonalizado(args);   
       }
   },

   Mutation:{
    addRoles:async(_,args,context)=>{
        args.nombre=args.nombre.toUpperCase().trim();
        let x=await ROLES.rolPersonalizadoGeneral(args);   

        if(x[0]!=null){
            if(!(x[0].deprecated)) {
                return x[0];
            }else if(x[0].deprecated){
                await ROLES.activoRoles(x[0].id);
                logRsv.Mutation.log(
                    undefined,
                    {
                        id_usuario: args.id_usuario,
                        descripcion: 'Se activo un rol',
                        operacion: {"entity": "roles", "command": "updated", "transaction_id":x[0].id}
                    },
                    context
                  );
                return x[0];
            }
        } else{
            let x= await ROLES.addRoles({nombre:args.nombre});
            logRsv.Mutation.log(
                undefined,
                {
                    id_usuario: args.id_usuario,
                    descripcion: 'Se creo un nuevo rol',
                    operacion: {"entity": "roles", "command": "created", "transaction_id":x.id}
                },
                context
              );
            return x;

        }

    }
   }
}