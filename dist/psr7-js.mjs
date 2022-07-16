import d from "deepmerge";
function a(t) {
  return /boolean|number|string/.test(typeof t);
}
const m = "http://localhost";
class l {
  constructor(e = b()) {
    if (!(e instanceof URL) && !a(e))
      throw TypeError("Expected string, got " + typeof e);
    try {
      this.url = new URL(e), this.absolute = !0;
    } catch {
      this.url = new URL(m + (e.indexOf("/") === 0 ? "" : "/") + e), this.absolute = !1;
    }
  }
  getScheme() {
    return this.absolute ? this.url.protocol.substr(0, this.url.protocol.length - 1) : "";
  }
  getUserInfo() {
    if (!this.absolute || this.url.username.length === 0 && this.url.password.length === 0)
      return "";
    let e = this.url.username;
    return this.url.password.length !== 0 && (e = e + ":" + this.url.password), e;
  }
  getHost() {
    return this.absolute ? this.url.hostname : "";
  }
  getPort() {
    return !this.absolute || this.url.port.length === 0 ? null : parseInt(this.url.port);
  }
  getPath() {
    return this.url.pathname;
  }
  getQuery() {
    return this.url.search.substr(1);
  }
  getFragment() {
    return this.url.hash.substr(1);
  }
  toString() {
    const e = this.url.toString();
    return this.absolute ? e : e.substr(m.length, e.length - m.length);
  }
  withScheme(e) {
    let r = new l(this.url.toString());
    return r.url.protocol = u(e), r;
  }
  withUserInfo(e, r = "") {
    let s = new l(this.url.toString());
    return s.url.username = u(e), s.url.password = u(r), s;
  }
  withHost(e) {
    let r = new l(this.url.toString());
    return r.url.hostname = u(e), r;
  }
  withPort(e) {
    let r = new l(this.url.toString());
    return r.url.port = u(e), r;
  }
  withPath(e) {
    let r = new l(this.url.toString());
    return r.url.pathname = u(e), r.absolute = this.absolute, r;
  }
  withQuery(e) {
    let r = new l(this.url.toString());
    return r.url.search = u(e), r.absolute = this.absolute, r;
  }
  withFragment(e) {
    let r = new l(this.url.toString());
    return r.url.hash = u(e), r.absolute = this.absolute, r;
  }
}
function b() {
  return typeof window < "u" ? window.location.href : "/";
}
function u(t) {
  if (t === null || typeof t > "u")
    return "";
  if (typeof t == "object" && typeof t.toString == "function")
    return t.toString();
  if (!a(t))
    throw TypeError("Unexpected value");
  return t;
}
function y(t) {
  if (t.indexOf("[") === -1)
    return [t];
  const e = t.split("[")[0], r = t.match(/\[(.*?)\]/g).map((s) => {
    const n = s.substr(1).substr(0, s.length - 2);
    return n.length !== 0 ? n : null;
  });
  return e === "" ? r : [
    e,
    ...r
  ];
}
const P = (t) => t === null ? null : isNaN(t) === !1 ? typeof t == "string" && t.startsWith("0") ? t : Number.isInteger(t) ? parseInt(t) : parseFloat(t) : a(t) && ["true", "on"].includes(t.toLowerCase()) ? !0 : a(t) && ["false", "off"].includes(t.toLowerCase()) ? !1 : t;
function w(t, e) {
  const r = {};
  let s, n, o = r;
  for (let i = 0; i < t.length; i++) {
    if (s = t[i], t[i - 1], n = t[i + 1], typeof n > "u") {
      if (Array.isArray(o)) {
        o.push(e);
        break;
      }
      o[s] = P(e);
      break;
    }
    if (Array.isArray(o)) {
      o.push(w(t.slice(i + 1, t.length), e));
      break;
    }
    o[s] = n === null ? [] : {}, o = o[s];
  }
  return r;
}
function h(t) {
  t.indexOf("?") === 0 && (t = t.substr(1));
  const e = t.split("&");
  let r = {};
  for (let s of e) {
    let n = s.split("=");
    if (n[0].length === 0 && (!a(n[1]) || n[1].length === 0))
      continue;
    let o = y(decodeURIComponent(n[0])), i = typeof n[1] > "u" || n[1] === "" ? null : decodeURIComponent(n[1]);
    r = d(r, w(o, i));
  }
  return r;
}
function p(t) {
  var e, r;
  if (t instanceof URL)
    return h(t.search);
  if (t instanceof l)
    return h(t.getQuery());
  if (a(t))
    return h(t);
  if (typeof t > "u")
    try {
      return h((r = (e = window == null ? void 0 : window.location) == null ? void 0 : e.search) != null ? r : "");
    } catch {
      return {};
    }
  if (Array.isArray(t) || typeof t != "object")
    throw TypeError("Invalid type for params.");
  return t;
}
function f(t, e, r = "&") {
  return e.length > 0 ? e + r + t : e + t;
}
function c(t, e = null, r = "") {
  if (a(t))
    return f(e === null ? encodeURIComponent(t) : encodeURIComponent(e) + "=" + encodeURIComponent(t), r);
  const s = Array.isArray(t);
  for (let n in t)
    if (!!t.hasOwnProperty(n)) {
      if (e === null) {
        r = c(t[n], n, r);
        continue;
      }
      if (s) {
        r = f(c(t[n], encodeURIComponent(e) + "[]"), r);
        continue;
      }
      r = f(c(t[n], encodeURIComponent(e) + "[" + encodeURIComponent(n) + "]"), r);
    }
  return r;
}
class g {
  constructor(e) {
    this.params = p(e);
  }
  getParams() {
    return this.params;
  }
  getParam(e) {
    let r, s = this.params;
    for (let n = 0; n < arguments.length; n++) {
      if (r = arguments[n], !s.hasOwnProperty(r))
        return;
      s = s[r];
    }
    return s;
  }
  hasParam(e) {
    let r, s = this.params;
    for (let n = 0; n < arguments.length; n++) {
      if (r = arguments[n], !s.hasOwnProperty(r))
        return !1;
      s = s[r];
    }
    return !0;
  }
  withParam(e, r, s = !0) {
    const n = y(e);
    Object.assign({}, this.params);
    let o = w(n, r);
    return this.withParams(o, s);
  }
  withParams(e, r = !0) {
    return r === !1 ? new g(Object.assign({}, this.params, p(e))) : new g(d(this.params, p(e)));
  }
  withoutParam(e) {
    let r = Object.assign({}, this.params), s, n = r;
    for (let o = 0, i = 1; o < arguments.length; o++, i++) {
      if (s = arguments[o], i === arguments.length) {
        delete n[s];
        break;
      }
      n = n[s];
    }
    return new g(r);
  }
  toString() {
    return c(this.params);
  }
  toJson() {
    return JSON.stringify(this.params, ...arguments);
  }
}
export {
  g as QueryString,
  l as URI
};
