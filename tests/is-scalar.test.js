import is_scalar from "../src/is-scalar";

test('It detects scalars', () => {
    expect(is_scalar('')).toBe(true);
    expect(is_scalar('foo')).toBe(true);
    expect(is_scalar(15)).toBe(true);
    expect(is_scalar(15.50)).toBe(true);
    expect(is_scalar(true)).toBe(true);
    expect(is_scalar(false)).toBe(true);
    expect(is_scalar(null)).toBe(false);
    expect(is_scalar(undefined)).toBe(false);
    expect(is_scalar({})).toBe(false);
    expect(is_scalar({foo: 'bar'})).toBe(false);
    expect(is_scalar([])).toBe(false);
    expect(is_scalar(['foo'])).toBe(false);
    expect(is_scalar(() => {})).toBe(false);
});