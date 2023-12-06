import { uri, URI } from "@/uri.ts";
import { it, expect, describe } from "vitest";

describe("URI", () => {
  it("is instantiatable", () => {
    expect(uri()).toBeInstanceOf(URI);
    expect(uri("http://example.org/")).toBeInstanceOf(URI);
    expect(uri(new URL("http://example.org/"))).toBeInstanceOf(URI);
    expect(uri("/foo/bar")).toBeInstanceOf(URI);
    expect(() => uri({ foo: "bar" })).toThrowError();
  });

  it('instanciates "/" by default', () => {
    expect(uri().toString()).toStrictEqual("/");
  });

  it("detects relative URLs", () => {
    expect(uri("http://example.org").absolute).toBe(true);
    expect(uri("http://example.org/foo/bar").absolute).toBe(true);
    expect(uri("/foo/bar").absolute).toBe(false);
    expect(uri("?foo=bar").absolute).toBe(false);
  });

  it("returns the proper scheme", () => {
    expect(uri("http://example.org").getScheme()).toBe("http");
    expect(uri("HTTP://EXAMPLE.ORG").getScheme()).toBe("http");
    expect(uri("https://example.org").getScheme()).toBe("https");
    expect(uri("/foo/bar").getScheme()).toBe("");
  });

  it("returns the proper user info", () => {
    expect(uri("http://example.org").getUserInfo()).toBe("");
    expect(uri("http://foo@example.org").getUserInfo()).toBe("foo");
    expect(uri("http://foo:bar@example.org").getUserInfo()).toBe("foo:bar");
    expect(uri("/foo/bar").getUserInfo()).toBe("");
  });

  it("returns the proper user host", () => {
    expect(uri("http://example.org").getHost()).toBe("example.org");
    expect(uri("http://foo@example.org").getHost()).toBe("example.org");
    expect(uri("http://www.example.org:8080").getHost()).toBe(
      "www.example.org",
    );
    expect(uri("/foo/bar").getHost()).toBe("");
  });

  it("returns the proper user port", () => {
    expect(uri("http://example.org").getPort()).toStrictEqual(null);
    expect(uri("http://example.org:8080").getPort()).toBe(8080);
    expect(uri("/foo/bar").getPort()).toStrictEqual(null);
  });

  it("returns the proper user path", () => {
    expect(uri("http://example.org").getPath()).toBe("/");
    expect(uri("http://example.org/").getPath()).toBe("/");
    expect(uri("/foo/bar").getPath()).toBe("/foo/bar");
  });

  it("returns the proper query string", () => {
    expect(uri("http://example.org").getQuery()).toBe("");
    expect(uri("http://example.org/?").getQuery()).toBe("");
    expect(uri("http://example.org/?foo=bar").getQuery()).toBe("foo=bar");
    expect(uri("?foo=bar").getQuery()).toBe("foo=bar");
  });

  it("can use query strings as objects", () => {
    let location = uri("http://example.org/?foo=bar");
    let qs = location.getQuery(true);
    expect(qs).toEqual({ foo: "bar" });
    expect(location.withQuery(qs.withParam("foo", "baz")).toString()).toBe(
      "http://example.org/?foo=baz",
    );
  });

  it("returns the proper fragment", () => {
    expect(uri("http://example.org").getFragment()).toBe("");
    expect(uri("http://example.org/#foo").getFragment()).toBe("foo");
    expect(uri("http://example.org/?foo=bar#baz").getFragment()).toBe("baz");
    expect(uri("?foo=bar#baz").getFragment()).toBe("baz");
  });

  it("returns a clone with a new scheme", () => {
    let original, modified;
    original = uri("https://example.org");
    modified = original.withScheme("http");
    expect(original.getScheme()).toBe("https");
    expect(modified.getScheme()).toBe("http");
    expect(modified.absolute).toBe(true);

    original = uri("/foo/bar");
    modified = original.withScheme("https");

    expect(original.toString()).toBe("/foo/bar");
    expect(modified.toString()).toBe("https://localhost/foo/bar");
    expect(modified.absolute).toBe(true);
  });

  it("returns a clone with a new user info", () => {
    let original, modified;
    original = uri("https://foo:bar@example.org");
    modified = original.withUserInfo("baz");
    expect(original.getUserInfo()).toBe("foo:bar");
    expect(modified.getUserInfo()).toBe("baz");
    expect(modified.withUserInfo("foobar", 1234).getUserInfo()).toBe(
      "foobar:1234",
    );
    expect(modified.withUserInfo("").getUserInfo()).toBe("");
    expect(modified.absolute).toBe(true);

    original = uri("/foo/bar");
    modified = original.withUserInfo("foo", "azerty");

    expect(original.toString()).toBe("/foo/bar");
    expect(modified.toString()).toBe("http://foo:azerty@localhost/foo/bar");
    expect(modified.absolute).toBe(true);
  });

  it("returns a clone with a new host", () => {
    let original, modified;
    original = uri("https://example.org");
    modified = original.withScheme("http");
    expect(original.getScheme()).toBe("https");
    expect(modified.getScheme()).toBe("http");
    expect(modified.absolute).toBe(true);

    original = uri("/foo/bar");
    modified = original.withHost("www.example.org");
    expect(modified.getHost()).toBe("www.example.org");
    expect(modified.toString()).toBe("http://www.example.org/foo/bar");
    expect(modified.absolute).toBe(true);
  });

  it("returns a clone with a new port", () => {
    let original, modified;
    original = uri("https://example.org");
    modified = original.withPort(8080);
    expect(original.getPort()).toStrictEqual(null);
    expect(modified.getPort()).toStrictEqual(8080);
    expect(modified.absolute).toBe(true);

    original = uri("/foo/bar");
    modified = original.withPort(8080);
    expect(original.getPort()).toStrictEqual(null);
    expect(modified.getPort()).toStrictEqual(8080);
    expect(modified.toString()).toBe("http://localhost:8080/foo/bar");
    expect(modified.absolute).toBe(true);
  });

  it("returns a clone with a new path", () => {
    let original, modified;
    original = uri("https://example.org");
    modified = original.withPath("/foo/bar");
    expect(original.getPath()).toStrictEqual("/");
    expect(modified.getPath()).toStrictEqual("/foo/bar");
    expect(modified.withPath(null).getPath()).toBe("/");
    expect(modified.absolute).toBe(true);

    original = uri("https://example.org/bar/foo");
    modified = original.withPath("/foo/bar");
    expect(original.getPath()).toStrictEqual("/bar/foo");
    expect(modified.getPath()).toStrictEqual("/foo/bar");
    expect(modified.absolute).toBe(true);

    original = uri("/bar/foo");
    modified = original.withPath("/foo/bar");
    expect(original.getPath()).toStrictEqual("/bar/foo");
    expect(modified.getPath()).toStrictEqual("/foo/bar");
    expect(modified.toString()).toBe("/foo/bar");
    expect(modified.absolute).toBe(false);
  });

  it("returns a clone with a new query string", () => {
    let original, modified;
    original = uri("https://example.org");
    modified = original.withQuery("foo=bar");
    expect(original.getQuery()).toStrictEqual("");
    expect(modified.getQuery()).toStrictEqual("foo=bar");
    expect(modified.withQuery(null).getQuery()).toBe("");
    expect(modified.absolute).toBe(true);

    original = uri("https://example.org/?");
    modified = original.withQuery("foo=bar");
    expect(original.getQuery()).toStrictEqual("");
    expect(modified.getQuery()).toStrictEqual("foo=bar");
    expect(modified.absolute).toBe(true);

    original = uri("https://example.org/?bar=foo");
    modified = original.withQuery("foo=bar");
    expect(original.getQuery()).toStrictEqual("bar=foo");
    expect(modified.getQuery()).toStrictEqual("foo=bar");
    expect(modified.absolute).toBe(true);

    original = uri("/foo/bar");
    modified = original.withQuery("foo=bar");
    expect(original.getQuery()).toStrictEqual("");
    expect(modified.getQuery()).toStrictEqual("foo=bar");
    expect(modified.toString()).toBe("/foo/bar?foo=bar");
    expect(modified.absolute).toBe(false);

    original = uri("/foo/bar?");
    modified = original.withQuery("foo=bar");
    expect(original.getQuery()).toStrictEqual("");
    expect(modified.getQuery()).toStrictEqual("foo=bar");
    expect(modified.toString()).toBe("/foo/bar?foo=bar");
    expect(modified.absolute).toBe(false);

    original = uri("/foo/bar?bar=foo");
    modified = original.withQuery("foo=bar");
    expect(original.getQuery()).toStrictEqual("bar=foo");
    expect(modified.getQuery()).toStrictEqual("foo=bar");
    expect(modified.toString()).toBe("/foo/bar?foo=bar");
    expect(modified.absolute).toBe(false);
  });

  it("returns a clone with a new fragment", () => {
    let original, modified;
    original = uri("https://example.org");
    modified = original.withFragment("bar");
    expect(original.getFragment()).toStrictEqual("");
    expect(modified.getFragment()).toStrictEqual("bar");
    expect(modified.absolute).toBe(true);

    original = uri("https://example.org/#foo");
    modified = original.withFragment("bar");
    expect(original.getFragment()).toStrictEqual("foo");
    expect(modified.getFragment()).toStrictEqual("bar");
    expect(modified.absolute).toBe(true);

    original = uri("/foo/bar");
    modified = original.withFragment("bar");
    expect(original.getFragment()).toStrictEqual("");
    expect(modified.getFragment()).toStrictEqual("bar");
    expect(modified.toString()).toBe("/foo/bar#bar");
    expect(modified.absolute).toBe(false);

    original = uri("/foo/bar#foo");
    modified = original.withFragment("bar");
    expect(original.getFragment()).toStrictEqual("foo");
    expect(modified.getFragment()).toStrictEqual("bar");
    expect(modified.toString()).toBe("/foo/bar#bar");
    expect(modified.absolute).toBe(false);
  });
});
