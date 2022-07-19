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

function _bf_getElementsByDeptoTramiteModulo(data) {
  const SCHEMA = inspect.object().shape({
    id_departamento: inspect.id(),
    id_tramite: inspect.id(),
    id_modulo: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_createElement(data) {
  const SCHEMA = inspect.object().shape({
    nombre: inspect.text_required(),
    primer_apellido: inspect.text_required(),
    segundo_apellido: inspect.text_optional_n_format(),
    telefono: inspect.telefono(),
    email: inspect.email(),
    union_tramite_configuracion: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_updateAtendido(data) {
  const SCHEMA = inspect.object().shape({
    id: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_updateObservacion(data) {
  const SCHEMA = inspect.object().shape({
    id: inspect.id(),
    observacion: inspect.text_required()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_getElementsByDates(data) {
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

function _bf_updateDeprecated(data) {
  const SCHEMA = inspect.object().shape({
    id: inspect.id()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

function _bf_getDatesCountByFullNameOrEmail(data) {
  const SCHEMA = inspect.object().shape({
    nombre: inspect.text_required(),
    primer_apellido: inspect.text_required(),
    segundo_apellido: inspect.text_optional_n_format(),
    email: inspect.email()
      });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

export {
  _bf_getElementById,
  _bf_getElementsByDeptoTramiteModulo,
  _bf_createElement,
  _bf_updateAtendido,
  _bf_updateObservacion,
  _bf_getElementsByDates,
  _bf_updateDeprecated,
  _bf_getDatesCountByFullNameOrEmail
};
