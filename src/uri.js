import is_scalar from './is-scalar';
const placeholder = 'http://localhost';

function current_location() {
    return (undefined !== window) ? window.location.href : '/';
}

function stringify(value) {
    if (null === value || undefined === value) {
        return '';
    }

    if ('object' === typeof value && 'function' === typeof value.toString) {
        return value.toString();
    }

    if (!is_scalar(value)) {
        throw TypeError('Unexpected value');
    }

    return value;
}

function nullify(value) {
    if (null === value || undefined === value) {
        return null;
    }

    if (!is_scalar(value)) {
        throw TypeError('Unexpected value');
    }

    return 0 === value.length ? null : value;
}

class URI {

    constructor(url = current_location()) {
        try {
            this.url = new URL(url);
            this.absolute = true;
        } catch (e) {
            this.url = new URL(placeholder + (0 === url.indexOf('/') ? '' : '/') + url);
            this.absolute = false;
        }
    }

    getScheme() {
        if (!this.absolute) {
            return '';
        }

        return this.url.protocol.substr(0, this.url.protocol.length - 1);
    }

    getUserInfo() {
        if (!this.absolute) {
            return '';
        }

        if (0 === this.url.username.length && 0 === this.url.password.length) {
            return '';
        }

        let user_info = this.url.username;

        if (0 !== this.url.password.length) {
            user_info = user_info + ':' + this.url.password;
        }

        return user_info;
    }

    getHost() {
        return this.url.hostname;
    }

    getPort() {
        if (0 === this.url.port.length) {
            return null;
        }
        return parseInt(this.url.port);
    }

    getPath() {
        return this.url.pathname;
    }

    getQuery() {
        return this.url.search.substr(1);
    }

    getFragment() {
        return this.url.hash.substr(1);
    }

    toString() {
        const url = this.url.toString();
        if (this.absolute) {
            return url;
        }

        return url.substr(placeholder.length, url.length - placeholder.length);
    }

    withScheme(scheme) {
        let clone = new URI(this.url.toString());
        clone.url.protocol = stringify(scheme);

        return clone;
    }

    withUserInfo(username, password = '') {
        let clone = new URI(this.url.toString());
        clone.url.username = stringify(username);
        clone.url.password = stringify(password);

        return clone;
    }

    withHost(host) {
        let clone = new URI(this.url.toString());
        clone.url.hostname = stringify(host);

        return clone;
    }

    withPort(port) {
        let clone = new URI(this.url.toString());
        clone.url.port = stringify(port);

        return clone;
    }

    withPath(path) {
        let clone = new URI(this.url.toString());
        clone.url.path = stringify(path);

        return clone;
    }

    withQuery(query) {
        let clone = new URI(this.url.toString());
        clone.url.search = stringify(query);

        return clone;
    }

    withfFragment(fragment) {
        let clone = new URI(this.url.toString());
        clone.url.hash = stringify(fragment);

        return clone;
    }
}

export default URI;