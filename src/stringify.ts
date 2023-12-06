import is_scalar from "./is-scalar";

function append(input: string, output: string, separator: string = '&') {
    return output.length > 0 ? output + separator + input : output + input;
}

function stringify(value: any, param: string|null = null, output: string = '') {

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
            // @ts-ignore
            output = append(stringify(value[key], encodeURIComponent(param) + '[]'), output);
            continue;
        }

        output = append(stringify(value[key], encodeURIComponent(param) + '[' + encodeURIComponent(key) + ']'), output);
    }

    return output;
}

export default stringify;
