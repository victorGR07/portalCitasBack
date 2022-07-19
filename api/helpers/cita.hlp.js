import moment from 'moment-timezone';
import { ValidationError } from '../assets/errors/ValidationError';
import { Dia } from '../models/dia';

const DIA = new Dia();

let _getDay = async ({ fecha, dias, tipo }) => {
  if (dias == 1) return fecha;

  let fecha_salida;
  let real_days = dias - 1;
  let count_days = 0;

  let sentido;
  switch (tipo) {
    case 'start':
      sentido = false;
      break;

    case 'end':
      sentido = true;
      break;
  }

  try {
    fecha_salida = moment(fecha, 'YYYY/MM/DD')
      .tz('America/Mexico_City')
      .format('YYYY-MM-DD');
    do {
      fecha_salida = _modifyDate(fecha_salida, sentido, 1);
      if (await _isValid(fecha_salida)) count_days++;
    } while (real_days > count_days);
  } catch (e) {
    throw new ValidationError(e);
  }

  return fecha_salida;
};

export { _getDay };

async function _isValid(fecha) {
  let day_week = moment(fecha).day();
  let lock_day = await DIA.getElementByDate(fecha);
  if (day_week === 0 || day_week === 6) return false;
  if (lock_day.length > 0) return false;
  return true;
}

function _modifyDate(fecha, sentido, dias) {
  if (sentido) {
    return moment(fecha, 'YYYY/MM/DD')
      .add(dias, 'days')
      .tz('America/Mexico_City')
      .format('YYYY-MM-DD');
  } else {
    return moment(fecha, 'YYYY/MM/DD')
      .subtract(dias, 'days')
      .tz('America/Mexico_City')
      .format('YYYY-MM-DD');
  }
}
