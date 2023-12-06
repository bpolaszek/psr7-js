import is_scalar from './is-scalar';

export default (value: any): any => {

    if (null === value) {
        return null;
    }

    if (!isNaN(value)) {
        if ('string' === typeof value && value.startsWith('0')) {
            return value;
        }

        const number = Number.isInteger(value) ? parseInt(value) : parseFloat(value);

        if ('string' === typeof value && number.toString() !== value) {
            return value;
        }

        return number;
    }

    if (is_scalar(value) && ['true', 'on'].includes(value.toLowerCase())) {
        return true;
    }

    if (is_scalar(value) && ['false', 'off'].includes(value.toLowerCase())) {
        return false;
    }

    return value;
}
