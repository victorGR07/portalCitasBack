import { Estados } from "../models/estados";

const ESTADOS= new Estados();

export default{
    Query:{
        estadosPersonalizados: async (root,args)=>{
            return await ESTADOS.estadosPersonalizados(args);
        }
    }
}