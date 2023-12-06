import { describe, test, it, expect } from "vitest";
import { query_string, QueryString } from "@";

describe("QueryString", function () {
  it("creates a QueryString object from a string", () => {
    let qs = query_string("foo=bar");
    expect(qs).toBeInstanceOf(QueryString);
    expect(qs.toString()).toBe("foo=bar");
    expect(qs.getParams()).toStrictEqual({ foo: "bar" });

    qs = query_string("?foo=bar");
    expect(qs.toString()).toBe("foo=bar");
    expect(qs.getParams()).toStrictEqual({ foo: "bar" });

    qs = query_string("foo=foo bar");
    expect(qs.toString()).toBe("foo=foo%20bar");
    expect(qs.getParams()).toStrictEqual({ foo: "foo bar" });

    qs = query_string("foo[]=bar");
    expect(qs.toString()).toBe("foo%5B%5D=bar");
    expect(qs.getParams()).toStrictEqual({ foo: ["bar"] });

    qs = query_string("foo%5B%5D=bar");
    expect(qs.toString()).toBe("foo%5B%5D=bar");
    expect(qs.getParams()).toStrictEqual({ foo: ["bar"] });
  });

  it("creates a QueryString object from an object", () => {
    const obj = {
      foo: "bar",
      foos: ["bar", "baz"],
      bar: {
        foo: "bar",
        bar: "baz",
      },
    };

    let qs = query_string(obj);
    expect(qs.toString()).toBe(
      "foo=bar&foos%5B%5D=bar&foos%5B%5D=baz&bar%5Bfoo%5D=bar&bar%5Bbar%5D=baz",
    );
    expect(qs.getParams()).toStrictEqual(obj);
  });

  it("returns the appropriate param", () => {
    let qs = query_string("foo=foo bar");

    expect(qs.hasParam("foo")).toBe(true);
    expect(qs.hasParam("bar")).toBe(false);
    expect(qs.getParam("foo")).toBe("foo bar");
    expect(qs.getParam("bar")).toStrictEqual(undefined);

    qs = query_string("foos[]=foo&foos[]=bar");
    expect(qs.hasParam("foos")).toBe(true);
    expect(qs.getParam("foos")).toStrictEqual(["foo", "bar"]);
    expect(qs.hasParam("foos", 0)).toBe(true);
    expect(qs.getParam("foos", 0)).toStrictEqual("foo");
    expect(qs.hasParam("foos", 1)).toBe(true);
    expect(qs.getParam("foos", 1)).toStrictEqual("bar");
    expect(qs.hasParam("foos", 2)).toBe(false);
    expect(qs.getParam("foos", 2)).toStrictEqual(undefined);

    qs = query_string("foos[foo]=bar&foos[bar]=foo");
    expect(qs.hasParam("foos")).toBe(true);
    expect(qs.getParam("foos")).toStrictEqual({ foo: "bar", bar: "foo" });
    expect(qs.hasParam("foos", "foo")).toBe(true);
    expect(qs.getParam("foos", "foo")).toStrictEqual("bar");
    expect(qs.hasParam("foos", "bar")).toBe(true);
    expect(qs.getParam("foos", "bar")).toStrictEqual("foo");
    expect(qs.hasParam("foos", "baz")).toBe(false);
    expect(qs.getParam("foos", "baz")).toStrictEqual(undefined);
  });

  it("creates a clone with a new param", () => {
    let original = query_string("foo=bar");
    let modified = original.withParam("bar", "foo");
    expect(original.toString()).toBe("foo=bar");
    expect(modified.toString()).toBe("foo=bar&bar=foo");
  });

  it("creates a clone with new params", () => {
    let original = query_string("foo=bar");
    let modified = original.withParams({ bar: "foo" });
    expect(original.toString()).toBe("foo=bar");
    expect(modified.toString()).toBe("foo=bar&bar=foo");
  });

  it("returns a clone without speficied param", () => {
    let original = query_string("foo=bar&bar=foo");
    let modified = original.withoutParam("foo");
    expect(modified.toString()).toBe("bar=foo");
  });

  test("even when the specified param is an array", () => {
    let original = query_string("foo[]=foo&foo[]=bar&bar=foo");
    let modified = original.withoutParam("foo");
    expect(modified.toString()).toBe("bar=foo");
  });

  test("even when the specified param is an object", () => {
    let original = query_string("foo[foo]=bar&foo[bar]=baz&bar=foo");
    let modified = original.withoutParam("foo");
    expect(modified.toString()).toBe("bar=foo");
  });

  it("removes only the selected key on an object", () => {
    let original = query_string("foo[foo]=bar&foo[bar]=baz&bar=foo");
    let modified = original.withoutParam("foo", "bar");
    expect(modified.toString()).toBe("foo%5Bfoo%5D=bar&bar=foo");
  });

  it("removes only the selected key on an array", () => {
    let original = query_string("foo[]=bar&foo[]=baz&bar=foo");
    let modified = original.withoutParam("foo", 0);
    expect(modified.toString()).toBe("foo%5B%5D=baz&bar=foo");
  });

  it("does nothing when the given index does not exist", () => {
    let original = query_string("foo[]=bar&foo[]=baz&bar=foo");
    let modified = original.withoutParam("foo", 3);
    expect(modified.toString()).toBe(original.toString());
  });

  it("serializes to JSON", () => {
    const obj = {
      foo: "bar",
      foos: ["bar", "baz"],
      bar: {
        foo: "bar",
        bar: "baz",
      },
    };

    let qs = query_string(obj);
    expect(JSON.stringify(qs)).toStrictEqual(JSON.stringify(obj));
  });
});
