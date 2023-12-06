import extract_path from './extract-path';
import is_scalar from "./is-scalar";
import create_object from './create-object';
import { URI } from "./uri";

function parse_string(string: string) {

    if (0 === string.indexOf('?')) {
        string = string.substr(1);
    }

    const pairs = string.split('&');
    let params = {};

    for (let pair of pairs) {
        let key_value = pair.split('=');
        if (0 === key_value[0].length && (!is_scalar(key_value[1]) || 0 === key_value[1].length)) {
            continue;
        }
        let path = extract_path(decodeURIComponent(key_value[0])) as unknown as string;
        let value = ('undefined' === typeof key_value[1] || '' === key_value[1]) ? null : decodeURIComponent(key_value[1]);
        params = Object.assign(structuredClone(params), create_object(path, value));
    }

    return params;
}

export default function parse_query_string(input: string|object) {

    if (input instanceof URL) {
        return parse_string(input.search);
    }

    if (input instanceof URI) {
        return parse_string(input.getQuery());
    }

    if (is_scalar(input)) {
        return parse_string(input);
    }

    if ('undefined' === typeof input) {
        return {}
    }

    if (Array.isArray(input)) {
        throw TypeError('Invalid type for params.');
    }

    if ('object' !== typeof input) {
        throw TypeError('Invalid type for params.');
    }

    return input;
}
