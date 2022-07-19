import { ServerError } from "../assets/errors/ServerError";
import { sendMailContrase } from "../helpers/email";
import { UsuarioModel } from "../models/usuario";
import logRsv from "./log.rsv";
import rolesRsv from "./roles.rsv";

const USUARIO= new UsuarioModel();

export default{
    Query:{
        usuarioPersonalizado:async(_,args)=>{
            return await USUARIO.usuarioPersonalizado(args);
        },
        cantidadPersonal:async(_,args)=>{
            let x= await USUARIO.cantidadPersonal();
            return x.count
        }
    },

    Mutation:{
        addUsuario:async(_,args,context)=>{
            args.nombre=args.nombre.toUpperCase().trim();
            args.primer_apellido=args.primer_apellido.toUpperCase().trim();
            args.segundo_apellido=null?args.segundo_apellido.toUpperCase().trim():args.segundo_apellido;
            args.curp=args.curp.toUpperCase().trim();
            args.correo=args.correo.trim();
            args.clave_privada=args.clave_privada.trim();


           const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const curp=/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
            
            if(!(regex.test(args.correo))) throw new ServerError(new Error('El correo no corresponde con la expresión'))
            if(!(curp.test(args.curp))) throw new ServerError(new Error('La curp no corresponde con la expresión'))
            

            let busquedaCurp= await USUARIO.usuarioPersonalizado({curp:args.curp});
            let busquedaCorreo= await USUARIO.usuarioPersonalizado({correo:args.correo});

            if(busquedaCurp[0]!=null || busquedaCorreo[0]!=null) throw new ServerError(new Error('Ya existe registro con los mismo datos'));

            let x= await USUARIO.createdUsuario(args);
            logRsv.Mutation.log(
                undefined,
                {
                    id_usuario: args.id_usuario,
                    descripcion: 'Se creo un nuevo usuario',
                    operacion: {"entity": "usuarios", "command": "created", "transaction_id":x.id}
                },
                context
              );

              let args2={
                nombre:x.nombre,
                primer_apellido:x.primer_apellido,
                segundo_apellido:x.segundo_apellido,
                email:x.correo,
                clave:args.clave
            }
            await sendMailContrase(args2);

            return x;
        },

        bloqueoActivoUsario:async(_,args,context)=>{
            let us=await USUARIO.usuarioPersonalizado({id:args.id});
            if(us[0]==null) return false
            switch(args.accion) {
                case 1:
                    if(us[0].bloqueado==args.valor){
                        return true
                    }else{
                       let x= await USUARIO.bloqueo_desbloqueoUsuario(args);
                       logRsv.Mutation.log(
                        undefined,
                        {
                            id_usuario: args.id_usuario,
                            descripcion: args.valor==true?'Se bloqueo un usuario':'Se desbloqueo un usuario',
                            operacion: {"entity": "usuarios", "command":args.valor==true?'bloqueo':'desbloqueo' , "transaction_id":x.id}
                        },
                        context
                      );
                       return true;
                    }

                break;   

                case 2:
                    if(us[0].estatus==args.valor){
                        return true
                    }else{
                        let x= await USUARIO.activo_desactivoUsuario(args);
                        logRsv.Mutation.log(
                            undefined,
                            {
                                id_usuario: args.id_usuario,
                                descripcion: args.valor==true?'Se activo un usuario':'Se desactivo un usuario',
                                operacion: {"entity": "usuarios", "command":args.valor==true?'activo':'desactivo' , "transaction_id":x.id}
                            },
                            context
                          );
                            return true;
                    }
                break;    
                    }

        },
        
        updatedUsuario:async(_,args,context)=>{
            args.nombre=args.nombre.toUpperCase().trim();
            args.primer_apellido=args.primer_apellido.toUpperCase().trim();
            args.segundo_apellido=null?args.segundo_apellido.toUpperCase().trim():args.segundo_apellido;
            args.curp=args.curp.toUpperCase().trim();
            args.correo=args.correo.trim();
            args.clave_privada=args.clave_privada.trim();

            const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            const curp=/^([A-Z][AEIOUX][A-Z]{2}\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])[HM](?:AS|B[CS]|C[CLMSH]|D[FG]|G[TR]|HG|JC|M[CNS]|N[ETL]|OC|PL|Q[TR]|S[PLR]|T[CSL]|VZ|YN|ZS)[B-DF-HJ-NP-TV-Z]{3}[A-Z\d])(\d)$/
              if(!(regex.test(args.correo))) throw new ServerError(new Error('El correo no corresponde con la expresión'))
              if(!(curp.test(args.curp))) throw new ServerError(new Error('La curp no corresponde con la expresión'))
              
  
              let busquedaCurp= await USUARIO.usuarioPersonalizado({curp:args.curp});
              let busquedaCorreo= await USUARIO.usuarioPersonalizado({correo:args.correo});

              if(busquedaCurp[0]!=null ){
                if ( busquedaCurp[0].id!=args.id) throw new ServerError(new Error('La curp ya se ocupo en otro registro'));
                }

              if(busquedaCorreo[0]!=null ){
                if (busquedaCorreo[0].id!=args.id) throw new ServerError(new Error('El correo ya se ocupo en otro registro'));
                } 
          
            let us=await USUARIO.usuarioPersonalizado({id:args.id});
                if(us[0]==null) throw new ServerError(new Error('Error en el parametro id'));
                
            let us2=await USUARIO.usuarioPersonalizado(args);
                if(us2[0]!=null) return us2[0];

            let x= await USUARIO.updatedUsuario(args);
            logRsv.Mutation.log(
                undefined,
                {
                    id_usuario: args.id_usuario,
                    descripcion:'Se actualizo un usuario',
                    operacion: {"entity": "usuarios", "command":'updated', "transaction_id":x.id,'value':us[0]}
                },
                context
              );

              if(args.clave){
                let args2={
                    nombre:x.nombre,
                    primer_apellido:x.primer_apellido,
                    segundo_apellido:x.segundo_apellido,
                    email:x.correo,
                    clave:args.clave
                }
                await sendMailContrase(args2);
            }


              return x;
        }

    },
    Usuarios:{
        rol:async(_,args)=>{
          let x= await rolesRsv.Query.rolPersonalizado(undefined,{id:_.id_rol});
            return x[0]
    },
    }
}