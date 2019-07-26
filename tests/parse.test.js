import parse_query_string from "../src/parse";
import URI from "../src/uri";

test('It converts a query string to an object', () => {
    expect(parse_query_string('foo=bar&bar=baz')).toStrictEqual({
        foo: 'bar',
        bar: 'baz'
    });
});

test('It converts blank values to null', () => {
    expect(parse_query_string('foo=bar&bar=')).toStrictEqual({
        foo: 'bar',
        bar: null
    });
    expect(parse_query_string('foo=bar&bar')).toStrictEqual({
        foo: 'bar',
        bar: null
    });
});

test('It convert arrays', () => {
    expect(parse_query_string('foo=bar&foos[]=foo&foos[]=bar')).toStrictEqual({
        foo: 'bar',
        foos: [
            'foo',
            'bar',
        ]
    });
});

test('It convert objects', () => {
    expect(parse_query_string('foos[]=foo&foos[]=bar&foo[bar]=baz&foo[bat]=foo')).toStrictEqual({
        foos: [
            'foo',
            'bar',
        ],
        foo: {
            bar: 'baz',
            bat: 'foo'
        }
    });
});

test('Even with uri-encoded data', () => {
    expect(parse_query_string("foos%5B%5D=foo&foos%5B%5D=bar&foo%5Bbar%5D=baz&foo%5Bbat%5D=foo")).toStrictEqual({
        foos: [
            'foo',
            'bar',
        ],
        foo: {
            bar: 'baz',
            bat: 'foo'
        }
    });
    expect(parse_query_string("foo%20bar=foo%5Bfoo%20bar%5D")).toStrictEqual({
        'foo bar': 'foo[foo bar]'
    });
});

test('It detects URL objects', () => {
    expect(parse_query_string(new URL('http://example.org/foo?foo=bar'))).toStrictEqual({
        foo: 'bar',
    });
});

test('It detects URL objects', () => {
    expect(parse_query_string(new URI('http://example.org/foo?foo=bar'))).toStrictEqual({
        foo: 'bar',
    });
});

test('It considers window.location.search is the default', () => {
    expect(parse_query_string()).toStrictEqual(parse_query_string(window.location.search));
});

test('It throws an error for other types', () => {
    expect(() => parse_query_string(() => {})).toThrowError();
    expect(() => parse_query_string([])).toThrowError();
});
