import is_scalar from "./is-scalar";

function append(input, output, separator = '&') {
    return output.length > 0 ? output + separator + input : output + input;
}

function stringify(value, param = null, output = '') {

    if (is_scalar(value)) {
        if (null === param) {
            return append(encodeURIComponent(value), output);
        } else {
            return append(encodeURIComponent(param) + '=' + encodeURIComponent(value), output);
        }
    }

    const isArray = Array.isArray(value);
    for (let key in value) {

        if (!value.hasOwnProperty(key)) {
            continue;
        }

        if (null === param) {
            output = stringify(value[key], key, output);
            continue;
        }

        if (isArray) {
            output = append(stringify(value[key], encodeURIComponent(param) + '[]'), output);
            continue;
        }

        output = append(stringify(value[key], encodeURIComponent(param) + '[' + encodeURIComponent(key) + ']'), output);
    }

    return output;
}

export default stringify;
