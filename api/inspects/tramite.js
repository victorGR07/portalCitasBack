import { inspect } from "../helpers/inspect";
import { ValidationError } from "../assets/errors/ValidationError";

function _bf_createElement(data) {
  const SCHEMA = inspect.object().shape({
    nombre: inspect.text_required_n_format(),
    requisitos: inspect.json()
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
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

export { _bf_createElement, _bf_updateElement };
