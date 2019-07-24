import merge from 'deepmerge';
import parse from './parse';
import extract_path from './extract-path';
import stringify from './stringify';
import create_object from './create-object';

class QueryString {

    constructor(params) {
        this.params = parse(params);
    }

    getParams() {
        return this.params;
    }

    getParam(key) {
        let current, next;
        let cursor = this.params;

        for (let i = 0; i < arguments.length; i++) {
            current = arguments[i];
            next = arguments[i + 1];

            if (!cursor.hasOwnProperty(current)) {
                return undefined;
            }

            cursor = cursor[current];
        }

        return cursor;
    }

    hasParam(key) {
        let current, next;
        let cursor = this.params;

        for (let i = 0; i < arguments.length; i++) {
            current = arguments[i];
            next = arguments[i + 1];

            if (!cursor.hasOwnProperty(current)) {
                return false;
            }

            cursor = cursor[current];
        }

        return true;
    }

    withParam(key, value, deep_merge = true) {

        const path = extract_path(key);
        let params = Object.assign({}, this.params);
        let object = create_object(path, value);

        return this.withParams(object, deep_merge);
    }

    withParams(params, deep_merge = true) {
        if (false === deep_merge) {
            return new QueryString(Object.assign({}, this.params, parse(params)));
        }

        return new QueryString(merge(this.params, parse(params)));
    }

    withoutParam(param) {
        let params = Object.assign({}, this.params);

        let current;
        let cursor = params;

        for (let i = 0, j = 1; i < arguments.length; i++, j++) {
            current = arguments[i];

            if (j === arguments.length) {
                delete cursor[current];
                break;
            }

            cursor = cursor[current];
        }

        return new QueryString(params);
    }

    toString() {
        return stringify(this.params);
    }

    toJson() {
        return JSON.stringify(this.params, ...arguments);
    }

}

export default QueryString;
