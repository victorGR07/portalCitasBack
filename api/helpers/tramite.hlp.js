import moment from 'moment';

function _getConfig(diaNormal, diaEspecial) {
    let config = {};
    if (!diaEspecial || !Object.keys(diaEspecial).length) {
        config.inicio = moment(diaNormal.inicio, 'H:mm');
        config.fin = moment(diaNormal.fin, 'H:mm');
    } else {
        let inicioNormal = moment(diaNormal.inicio, 'H:mm');
        let finNormal = moment(diaNormal.fin, 'H:mm');
        let inicioEspecial = moment(diaEspecial.inicio, 'H:mm');
        let finEspecial = moment(diaEspecial.fin, 'H:mm');

        config.inicio =
            inicioNormal.diff(inicioEspecial) < 0
                ? inicioEspecial
                : inicioNormal;

        config.fin = finNormal.diff(finEspecial) < 0 ? finNormal : finEspecial;
    }
    return config;
}

export { _getConfig };
