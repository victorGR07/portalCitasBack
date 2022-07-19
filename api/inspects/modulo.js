import { inspect } from '../helpers/inspect';
import { ValidationError } from '../assets/errors/ValidationError';

function _bf_getElementById(data) {
  const SCHEMA = inspect.object().shape({
    id: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_getElementsByTramite(data) {
  const SCHEMA = inspect.object().shape({
    tramite_id: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_createElement(data) {
  const SCHEMA = inspect.object().shape({
    nombre: inspect.text_required_n_format(),
    direccion: inspect.text_required_n_format(),
    id_personal: inspect.id(),
    configuracion: inspect.json()
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

function _bf_updateElement(data) {
  const SCHEMA = inspect.object().shape({
    id: inspect.id(),
    nombre: inspect.text_required_n_format(),
    direccion: inspect.text_required_n_format(),
    personal_id: inspect.id(),
    configuracion: inspect.json()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

export {
  _bf_getElementById,
  _bf_getElementsByTramite,
  _bf_createElement,
  _bf_getElementsByDepartamento,
  _bf_updateElement
};
