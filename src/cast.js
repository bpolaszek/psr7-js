import is_scalar from './is-scalar';

export default (value) => {

    if (false === isNaN(value)) {
        return Number.isInteger(value) ? parseInt(value) : parseFloat(value);
    }

    if (is_scalar(value) && ['true', 'on'].includes(value.toLowerCase())) {
        return true;
    }

    if (is_scalar(value) && ['false', 'off'].includes(value.toLowerCase())) {
        return false;
    }

    return value;
}
