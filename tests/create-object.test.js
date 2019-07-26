import create_object from "../src/create-object";

test('It creates simple objects', () => {
    expect(create_object(['foo'], 'bar')).toStrictEqual({foo: 'bar'});
});

test('It creates deep objects', () => {
    expect(create_object(['foo', 'bar', 'baz'], 'bar')).toStrictEqual({foo: {bar: {baz: 'bar'}}});
});

test('It handles arrays as well', () => {
    expect(create_object(['foo', null, 'baz'], 'bar')).toStrictEqual({foo: [{baz: 'bar'}]});
});

test('It handles nulls and undefined too', () => {
    expect(create_object(['foo'], null)).toStrictEqual({foo: null});
    expect(create_object(['foo'], undefined)).toStrictEqual({foo: undefined});
});