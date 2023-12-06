import {test, expect} from 'vitest'
import { QueryString } from "@/query-string.ts";

test('It creates a QueryString object from a string', () => {
    let qs =new QueryString('foo=bar');
    expect(qs.toString()).toBe('foo=bar');
    expect(qs.getParams()).toStrictEqual({foo: 'bar'});

    qs = new QueryString('?foo=bar');
    expect(qs.toString()).toBe('foo=bar');
    expect(qs.getParams()).toStrictEqual({foo: 'bar'});

    qs = new QueryString('foo=foo bar');
    expect(qs.toString()).toBe('foo=foo%20bar');
    expect(qs.getParams()).toStrictEqual({foo: 'foo bar'});

    qs = new QueryString('foo[]=bar');
    expect(qs.toString()).toBe('foo%5B%5D=bar');
    expect(qs.getParams()).toStrictEqual({foo: ['bar']});

    qs = new QueryString('foo%5B%5D=bar');
    expect(qs.toString()).toBe('foo%5B%5D=bar');
    expect(qs.getParams()).toStrictEqual({foo: ['bar']});
});

test('It creates a QueryString object from an object', () => {
    const obj = {
        foo: 'bar',
        foos: [
            'bar',
            'baz'
        ],
        bar: {
            foo: 'bar',
            bar: 'baz',
        },
    };

    let qs = new QueryString(obj);
    expect(qs.toString()).toBe('foo=bar&foos%5B%5D=bar&foos%5B%5D=baz&bar%5Bfoo%5D=bar&bar%5Bbar%5D=baz');
    expect(qs.getParams()).toStrictEqual(obj);
});

test('It returns the appropriate param', () => {

    let qs = new QueryString('foo=foo bar');

    expect(qs.hasParam('foo')).toBe(true);
    expect(qs.hasParam('bar')).toBe(false);
    expect(qs.getParam('foo')).toBe('foo bar');
    expect(qs.getParam('bar')).toStrictEqual(undefined);

    qs = new QueryString('foos[]=foo&foos[]=bar');
    expect(qs.hasParam('foos')).toBe(true);
    expect(qs.getParam('foos')).toStrictEqual(['foo', 'bar']);
    expect(qs.hasParam('foos', 0)).toBe(true);
    expect(qs.getParam('foos', 0)).toStrictEqual('foo');
    expect(qs.hasParam('foos', 1)).toBe(true);
    expect(qs.getParam('foos', 1)).toStrictEqual('bar');
    expect(qs.hasParam('foos', 2)).toBe(false);
    expect(qs.getParam('foos', 2)).toStrictEqual(undefined);

    qs = new QueryString('foos[foo]=bar&foos[bar]=foo');
    expect(qs.hasParam('foos')).toBe(true);
    expect(qs.getParam('foos')).toStrictEqual({foo: 'bar', bar: 'foo'});
    expect(qs.hasParam('foos', 'foo')).toBe(true);
    expect(qs.getParam('foos', 'foo')).toStrictEqual('bar');
    expect(qs.hasParam('foos', 'bar')).toBe(true);
    expect(qs.getParam('foos', 'bar')).toStrictEqual('foo');
    expect(qs.hasParam('foos', 'baz')).toBe(false);
    expect(qs.getParam('foos', 'baz')).toStrictEqual(undefined);

});

test('It creates a clone with a new param', () => {
    let original = new QueryString('foo=bar');
    let modified = original.withParam('bar', 'foo');
    expect(original.toString()).toBe('foo=bar');
    expect(modified.toString()).toBe('foo=bar&bar=foo');
});

test('It creates a clone with new params', () => {
    let original = new QueryString('foo=bar');
    let modified = original.withParams({bar: 'foo'});
    expect(original.toString()).toBe('foo=bar');
    expect(modified.toString()).toBe('foo=bar&bar=foo');
});

test('It returns a clone without speficied param', () => {
    let original = new QueryString('foo=bar&bar=foo');
    let modified = original.withoutParam('foo');
    expect(modified.toString()).toBe('bar=foo');
});

test('Even when the specified param is an array', () => {
    let original = new QueryString('foo[]=foo&foo[]=bar&bar=foo');
    let modified = original.withoutParam('foo');
    expect(modified.toString()).toBe('bar=foo');
});

test('Even when the specified param is an object', () => {
    let original = new QueryString('foo[foo]=bar&foo[bar]=baz&bar=foo');
    let modified = original.withoutParam('foo');
    expect(modified.toString()).toBe('bar=foo');
});

test('It removes only the selected key on an object', () => {
    let original = new QueryString('foo[foo]=bar&foo[bar]=baz&bar=foo');
    let modified = original.withoutParam('foo', 'bar');
    expect(modified.toString()).toBe('foo%5Bfoo%5D=bar&bar=foo');
});

test('It removes only the selected key on an array', () => {
    let original = new QueryString('foo[]=bar&foo[]=baz&bar=foo');
    let modified = original.withoutParam('foo', 0);
    expect(modified.toString()).toBe('foo%5B%5D=baz&bar=foo');
});

test('It does nothing when the given index does not exist', () => {
    let original = new QueryString('foo[]=bar&foo[]=baz&bar=foo');
    let modified = original.withoutParam('foo', 3);
    expect(modified.toString()).toBe(original.toString());
});

test('It serializes to JSON', () => {
    const obj = {
        foo: 'bar',
        foos: [
            'bar',
            'baz'
        ],
        bar: {
            foo: 'bar',
            bar: 'baz',
        },
    };

    let qs = new QueryString(obj);
    expect(JSON.stringify(qs)).toStrictEqual(JSON.stringify(obj));
});
