import { inspect } from '../helpers/inspect';
import { ValidationError } from '../assets/errors/ValidationError';

function _bf_getElementsByDepartamentoAndModulo(data) {
  const SCHEMA = inspect.object().shape({
    id_departamento: inspect.id(),
    id_modulo: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_getElementsByDepartamento(data) {
  const SCHEMA = inspect.object().shape({
    id_departamento: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

export {
  _bf_getElementsByDepartamentoAndModulo,
  _bf_getElementsByDepartamento
};
