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
    description: inspect.text_required(),
    id_user: inspect.id(),
    user_description: inspect.text_required(),
    workplace: inspect.text_required(),
    region: inspect.text_required(),
    ip_address: inspect.text_required_n_format(),
    user_agent: inspect.text_required_n_format(),
    http_method: inspect.text_required()
  });
  try {
    return SCHEMA.validateSync(data);
  } catch (e) {
    throw new ValidationError(e);
  }
}

export { _bf_getElementById, _bf_createElement };
