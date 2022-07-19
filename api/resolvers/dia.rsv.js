import { Dia } from '../models/dia';
import moment from "moment-timezone";
import logRsv from './log.rsv';

const DIA = new Dia();

export default {
  Query: {
    dias: async (root, args) => {
      let dias = await DIA.getElements();
      return dias;
    }
  },
  Mutation: {
    dia: async (root, args,context) => {
      let [dia] = await DIA.createElement(args);
      logRsv.Mutation.log(
        undefined,
        {
            id_usuario: args.id_usuario,
            descripcion: 'Se agrego un nuevo día',
            operacion: {"entity": "dias", "command": "created", "transaction_id":dia.id}
        },
        context
      );
      return dia;
    },
    diaToState: async (root, args,context) => {
      let state = await DIA.toState(args);
      if(state){
        logRsv.Mutation.log(
          undefined,
          {
              id_usuario: args.id_usuario,
              descripcion: 'Se depreco un dia',
              operacion: {"entity": "dias", "command": "created", "transaction_id":args.id}
          },
          context
        );
      }
      return state;
    }
  },
  Dia: {
    fecha: async (root, args) => {
      return moment(root.fecha, "YYYY/MM/DD")
        .tz("America/Mexico_City")
        .format("DD-MM-YYYY");
    }
  }
}
