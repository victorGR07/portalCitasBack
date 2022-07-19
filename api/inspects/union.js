import { inspect } from '../helpers/inspect';
import { ValidationError } from '../assets/errors/ValidationError';

function _bf_createElement(data) {
    const SCHEMA = inspect.object().shape({
        id_departamento: inspect.id(),
        id_tramite: inspect.id(),
        id_modulo: inspect.id(),
        configuracion: inspect.json()
    });
    try {
        return SCHEMA.validateSync(data);
    } catch (e) {
        throw new ValidationError(e);
    }
}

function _bf_getElementsByDeptoModulo(data) {
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

function _bf_updateConfiguracion(data) {
    const SCHEMA = inspect.object().shape({
        configuracion: inspect.json()
    });
    try {
        return SCHEMA.validateSync(data);
    } catch (e) {
        throw new ValidationError(e);
    }
}

export {
    _bf_getElementsByDeptoModulo,
    _bf_createElement,
    _bf_updateConfiguracion
};
