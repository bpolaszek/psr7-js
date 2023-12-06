import { die } from "./utils.ts";

type Stringable = string | { toString(): string };

const placeholder = "http://localhost";

function isStringable(value: any): boolean {
  return (
    "string" === typeof value ||
    ("object" === typeof value && "[object Object]" !== value?.toString())
  );
}

export class URI {
  private absolute: boolean = false;
  private url: URL;

  constructor(url: Stringable = "/") {
    isStringable(url) ||
      die(new TypeError("Expected string, got " + typeof url));
    try {
      this.url = new URL(url.toString());
      this.absolute = true;
    } catch (e) {
      this.url = new URL(
        placeholder + (0 === url.toString().indexOf("/") ? "" : "/") + url,
      );
      this.absolute = false;
    }
  }

  getScheme(): string {
    return !this.absolute
      ? ""
      : this.url.protocol.substring(0, this.url.protocol.indexOf(":"));
  }

  getUserInfo() {
    if (!this.absolute) {
      return "";
    }

    if (0 === this.url.username.length && 0 === this.url.password.length) {
      return "";
    }

    let userInfo = this.url.username;

    if (0 !== this.url.password.length) {
      userInfo = userInfo + ":" + this.url.password;
    }

    return userInfo;
  }

  getHost() {
    return !this.absolute ? "" : this.url.hostname;
  }

  getPort() {
    return 0 === this.url.port.length ? null : parseInt(this.url.port);
  }

  getPath() {
    return this.url.pathname;
  }

  getQuery() {
    return this.url.search.substring(1);
  }

  getFragment() {
    return this.url.hash.substring(1);
  }

  toString() {
    const url = this.url.toString();
    if (this.absolute) {
      return url;
    }

    return url.substring(placeholder.length);
  }

  withScheme(scheme: Stringable) {
    let clone = new URI(this.url.toString());
    clone.url.protocol = scheme.toString();

    return clone;
  }

  withUserInfo(username: Stringable | null, password: Stringable | null = "") {
    let clone = new URI(this.url.toString());
    clone.url.username = username?.toString() ?? "";
    clone.url.password = password?.toString() ?? "";

    return clone;
  }

  withHost(host: Stringable) {
    let clone = new URI(this.url.toString());
    clone.url.hostname = host.toString();

    return clone;
  }

  withPort(port: number) {
    let clone = new URI(this.url.toString());
    clone.url.port = `${port}`;

    return clone;
  }

  withPath(path: Stringable | null) {
    let clone = new URI(this.url.toString());
    clone.url.pathname = path?.toString() ?? "/";
    clone.absolute = this.absolute;

    return clone;
  }

  withQuery(query: Stringable | null) {
    let clone = new URI(this.url.toString());
    clone.url.search = query?.toString() ?? "";
    clone.absolute = this.absolute;

    return clone;
  }

  withFragment(fragment: Stringable | null) {
    let clone = new URI(this.url.toString());
    clone.url.hash = fragment?.toString() ?? "";
    clone.absolute = this.absolute;

    return clone;
  }
}
