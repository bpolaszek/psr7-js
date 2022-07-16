import extract_path from "../src/extract-path";

test('It converts a path to an array', () => {
    expect(extract_path('foo')).toStrictEqual(['foo']);
    expect(extract_path('foo[bar]')).toStrictEqual(['foo', 'bar']);
    expect(extract_path('foo[bar][]')).toStrictEqual(['foo', 'bar', null]);
    expect(extract_path('foo[bar][][baz]')).toStrictEqual(['foo', 'bar', null, 'baz']);
});
