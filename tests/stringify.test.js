import stringify from "../src/stringify";

test('It stringifies and uri-encodes a scalar', () => {
    expect(stringify('foo bar', 'bar foo')).toBe('bar%20foo=foo%20bar');
});

test('It appends it on an existing string', () => {
    expect(stringify('bar', 'foo', 'baz')).toBe('baz&foo=bar');
});

test('It stringifies and uri-encodes an array', () => {
    expect(stringify(['bar', 'baz'], 'foo')).toBe('foo%5B%5D=bar&foo%5B%5D=baz');
});

test('It stringifies and uri-encodes an object', () => {
    expect(stringify({'foo': 'bar', 'baz': 'bat'}, 'foo')).toBe('foo%5Bfoo%5D=bar&foo%5Bbaz%5D=bat');
});

test('It just appends the value when the param is null', () => {
    expect(stringify('bar', null, 'foo')).toBe('foo&bar');
});
