import { inspect } from "../helpers/inspect";
import { ValidationError } from "../assets/errors/ValidationError";

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

function _bf_createElement(data) {
  const SCHEMA = inspect.object().shape({
    nombre: inspect.text_required_n_format(),
    primer_apellido: inspect.text_required_n_format(),
    segundo_apellido: inspect.text_n_required_n_format()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

export { _bf_getElementById, _bf_createElement };
