import extract_path from './extract-path';
import is_scalar from "./is-scalar";
import merge from "deepmerge";
import create_object from './create-object';

function parse_string(string) {

    if (0 === string.indexOf('?')) {
        string = string.substr(1);
    }

    const pairs = string.split('&');
    let params = {};

    for (let pair of pairs) {
        let key_value = pair.split('=');
        if (0 === key_value[0].length && 0 === key_value[1].length) {
            continue;
        }
        let path = extract_path(decodeURIComponent(key_value[0]));
        let value = undefined === key_value[1] ? null : decodeURIComponent(key_value[1]);
        params = merge(params, create_object(path, value));
    }

    return params;
}

export default (input) => {

    if (input instanceof URL) {
        return parse_string(input.search);
    }

    if (is_scalar(input)) {
        return parse_string(input);
    }

    if (undefined === input) {
        try {
            return parse_string(window.location.search);
        } catch (e) {
            return {};
        }
    }

    if ('object' !== typeof input) {
        throw TypeError('Invalid type for params.');
    }

    return input;
}
