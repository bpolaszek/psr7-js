import URI from "../src/uri";

test('It is instantiatable', () => {
    expect(new URI()).toBeInstanceOf(URI);
    expect(new URI('http://example.org/')).toBeInstanceOf(URI);
    expect(new URI(new URL('http://example.org/'))).toBeInstanceOf(URI);
    expect(new URI('/foo/bar')).toBeInstanceOf(URI);
    expect(() => new URI({foo: 'bar'})).toThrowError();
});

test('It instanciates window.location.href by default', () => {
    expect(new URI().toString()).toStrictEqual(window.location.href);
});

test('It detects relative URLs', () => {
    expect(new URI('http://example.org').absolute).toBe(true);
    expect(new URI('http://example.org/foo/bar').absolute).toBe(true);
    expect(new URI('/foo/bar').absolute).toBe(false);
    expect(new URI('?foo=bar').absolute).toBe(false);
});

test('It returns the proper scheme', () => {
    expect(new URI('http://example.org').getScheme()).toBe('http');
    expect(new URI('HTTP://EXAMPLE.ORG').getScheme()).toBe('http');
    expect(new URI('https://example.org').getScheme()).toBe('https');
    expect(new URI('/foo/bar').getScheme()).toBe('');
});

test('It returns the proper user info', () => {
    expect(new URI('http://example.org').getUserInfo()).toBe('');
    expect(new URI('http://foo@example.org').getUserInfo()).toBe('foo');
    expect(new URI('http://foo:bar@example.org').getUserInfo()).toBe('foo:bar');
    expect(new URI('/foo/bar').getUserInfo()).toBe('');
});

test('It returns the proper user host', () => {
    expect(new URI('http://example.org').getHost()).toBe('example.org');
    expect(new URI('http://foo@example.org').getHost()).toBe('example.org');
    expect(new URI('http://www.example.org:8080').getHost()).toBe('www.example.org');
    expect(new URI('/foo/bar').getHost()).toBe('');
});

test('It returns the proper user port', () => {
    expect(new URI('http://example.org').getPort()).toStrictEqual(null);
    expect(new URI('http://example.org:8080').getPort()).toBe(8080);
    expect(new URI('/foo/bar').getPort()).toStrictEqual(null);
});

test('It returns the proper user path', () => {
    expect(new URI('http://example.org').getPath()).toBe('/');
    expect(new URI('http://example.org/').getPath()).toBe('/');
    expect(new URI('/foo/bar').getPath()).toBe('/foo/bar');
});

test('It returns the proper query string', () => {
    expect(new URI('http://example.org').getQuery()).toBe('');
    expect(new URI('http://example.org/?').getQuery()).toBe('');
    expect(new URI('http://example.org/?foo=bar').getQuery()).toBe('foo=bar');
    expect(new URI('?foo=bar').getQuery()).toBe('foo=bar');
});

test('It returns the proper fragment', () => {
    expect(new URI('http://example.org').getFragment()).toBe('');
    expect(new URI('http://example.org/#foo').getFragment()).toBe('foo');
    expect(new URI('http://example.org/?foo=bar#baz').getFragment()).toBe('baz');
    expect(new URI('?foo=bar#baz').getFragment()).toBe('baz');
});

test('It returns a clone with a new scheme', () => {
    let original, modified;
    original = new URI('https://example.org');
    modified = original.withScheme('http');
    expect(original.getScheme()).toBe('https');
    expect(modified.getScheme()).toBe('http');
    expect(modified.absolute).toBe(true);

    original = new URI('/foo/bar');
    modified = original.withScheme('https');

    expect(original.toString()).toBe('/foo/bar');
    expect(modified.toString()).toBe('https://localhost/foo/bar');
    expect(modified.absolute).toBe(true);
});

test('It returns a clone with a new user info', () => {
    let original, modified;
    original = new URI('https://foo:bar@example.org');
    modified = original.withUserInfo('baz');
    expect(original.getUserInfo()).toBe('foo:bar');
    expect(modified.getUserInfo()).toBe('baz');
    expect(modified.withUserInfo('foobar', 1234).getUserInfo()).toBe('foobar:1234');
    expect(modified.withUserInfo('').getUserInfo()).toBe('');
    expect(modified.absolute).toBe(true);

    original = new URI('/foo/bar');
    modified = original.withUserInfo('foo', 'azerty');

    expect(original.toString()).toBe('/foo/bar');
    expect(modified.toString()).toBe('http://foo:azerty@localhost/foo/bar');
    expect(modified.absolute).toBe(true);
});

test('It returns a clone with a new host', () => {
    let original, modified;
    original = new URI('https://example.org');
    modified = original.withScheme('http');
    expect(original.getScheme()).toBe('https');
    expect(modified.getScheme()).toBe('http');
    expect(modified.absolute).toBe(true);

    original = new URI('/foo/bar');
    modified = original.withHost('www.example.org');
    expect(modified.getHost()).toBe('www.example.org');
    expect(modified.toString()).toBe('http://www.example.org/foo/bar');
    expect(modified.absolute).toBe(true);
});

test('It returns a clone with a new port', () => {
    let original, modified;
    original = new URI('https://example.org');
    modified = original.withPort(8080);
    expect(original.getPort()).toStrictEqual(null);
    expect(modified.getPort()).toStrictEqual(8080);
    expect(modified.absolute).toBe(true);

    original = new URI('/foo/bar');
    modified = original.withPort(8080);
    expect(original.getPort()).toStrictEqual(null);
    expect(modified.getPort()).toStrictEqual(8080);
    expect(modified.toString()).toBe('http://localhost:8080/foo/bar');
    expect(modified.absolute).toBe(true);
});

test('It returns a clone with a new path', () => {
    let original, modified;
    original = new URI('https://example.org');
    modified = original.withPath('/foo/bar');
    expect(original.getPath()).toStrictEqual('/');
    expect(modified.getPath()).toStrictEqual('/foo/bar');
    expect(modified.withPath(null).getPath()).toBe('/');
    expect(modified.absolute).toBe(true);

    original = new URI('https://example.org/bar/foo');
    modified = original.withPath('/foo/bar');
    expect(original.getPath()).toStrictEqual('/bar/foo');
    expect(modified.getPath()).toStrictEqual('/foo/bar');
    expect(modified.absolute).toBe(true);

    original = new URI('/bar/foo');
    modified = original.withPath('/foo/bar');
    expect(original.getPath()).toStrictEqual('/bar/foo');
    expect(modified.getPath()).toStrictEqual('/foo/bar');
    expect(modified.toString()).toBe('/foo/bar');
    expect(modified.absolute).toBe(false);
});

test('It returns a clone with a new query string', () => {
    let original, modified;
    original = new URI('https://example.org');
    modified = original.withQuery('foo=bar');
    expect(original.getQuery()).toStrictEqual('');
    expect(modified.getQuery()).toStrictEqual('foo=bar');
    expect(modified.withQuery(null).getQuery()).toBe('');
    expect(() => modified.withQuery(() => {}).getQuery()).toThrowError();
    expect(modified.absolute).toBe(true);

    original = new URI('https://example.org/?');
    modified = original.withQuery('foo=bar');
    expect(original.getQuery()).toStrictEqual('');
    expect(modified.getQuery()).toStrictEqual('foo=bar');
    expect(modified.absolute).toBe(true);

    original = new URI('https://example.org/?bar=foo');
    modified = original.withQuery('foo=bar');
    expect(original.getQuery()).toStrictEqual('bar=foo');
    expect(modified.getQuery()).toStrictEqual('foo=bar');
    expect(modified.absolute).toBe(true);

    original = new URI('/foo/bar');
    modified = original.withQuery('foo=bar');
    expect(original.getQuery()).toStrictEqual('');
    expect(modified.getQuery()).toStrictEqual('foo=bar');
    expect(modified.toString()).toBe('/foo/bar?foo=bar');
    expect(modified.absolute).toBe(false);

    original = new URI('/foo/bar?');
    modified = original.withQuery('foo=bar');
    expect(original.getQuery()).toStrictEqual('');
    expect(modified.getQuery()).toStrictEqual('foo=bar');
    expect(modified.toString()).toBe('/foo/bar?foo=bar');
    expect(modified.absolute).toBe(false);

    original = new URI('/foo/bar?bar=foo');
    modified = original.withQuery('foo=bar');
    expect(original.getQuery()).toStrictEqual('bar=foo');
    expect(modified.getQuery()).toStrictEqual('foo=bar');
    expect(modified.toString()).toBe('/foo/bar?foo=bar');
    expect(modified.absolute).toBe(false);
});

test('It returns a clone with a new fragment', () => {
    let original, modified;
    original = new URI('https://example.org');
    modified = original.withFragment('bar');
    expect(original.getFragment()).toStrictEqual('');
    expect(modified.getFragment()).toStrictEqual('bar');
    expect(modified.absolute).toBe(true);

    original = new URI('https://example.org/#foo');
    modified = original.withFragment('bar');
    expect(original.getFragment()).toStrictEqual('foo');
    expect(modified.getFragment()).toStrictEqual('bar');
    expect(modified.absolute).toBe(true);

    original = new URI('/foo/bar');
    modified = original.withFragment('bar');
    expect(original.getFragment()).toStrictEqual('');
    expect(modified.getFragment()).toStrictEqual('bar');
    expect(modified.toString()).toBe('/foo/bar#bar');
    expect(modified.absolute).toBe(false);

    original = new URI('/foo/bar#foo');
    modified = original.withFragment('bar');
    expect(original.getFragment()).toStrictEqual('foo');
    expect(modified.getFragment()).toStrictEqual('bar');
    expect(modified.toString()).toBe('/foo/bar#bar');
    expect(modified.absolute).toBe(false);
});
