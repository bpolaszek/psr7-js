var w = Object.defineProperty;
var O = (r, t, e) => t in r ? w(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var h = (r, t, e) => (O(r, typeof t != "symbol" ? t + "" : t, e), e);
function y(r) {
  return /boolean|number|string/.test(typeof r);
}
function P(r) {
  if (r.indexOf("[") === -1)
    return [r];
  const t = r.split("[")[0], e = r.match(/\[(.*?)\]/g).map((n) => {
    const o = n.substring(1).substr(0, n.length - 2);
    return o.length !== 0 ? decodeURIComponent(o) : null;
  });
  return t === "" ? e : [decodeURIComponent(t), ...e];
}
function b(r, t, e) {
  const n = r.shift(), o = [...r].shift();
  return o === void 0 ? e[n] = t : o === null ? (e[n] = e[n] ?? [], e[n].push(t)) : (e[n] = e[n] ?? {}, e[n] = b(r, t, e[n])), e;
}
function* p(r, t = []) {
  for (const e of Object.keys(r)) {
    const n = r[e];
    y(n) || n === null ? yield [[...t, e], n] : yield* p(n, [...t, e]);
  }
}
function S(r, t = "&") {
  r.indexOf("?") === 0 && (r = r.substring(1)), r = decodeURI(r);
  let e = r.split(t);
  const n = {};
  for (const o of e) {
    let s = o.indexOf("=");
    s === -1 && (s = o.length);
    const f = P(o.substring(0, s));
    let l = s === o.length ? null : o.substring(s + 1);
    typeof l == "string" && (l = decodeURIComponent(l)), b(f, l, n);
  }
  return n;
}
function j(r, t = []) {
  for (const e of Object.keys(r)) {
    const n = r[e];
    if (n === null)
      t.push(`${encodeURIComponent(e)}`);
    else if (Array.isArray(n))
      t.push(
        ...n.map(
          (o) => `${encodeURIComponent(e)}%5B%5D=${encodeURIComponent(o)}`
        )
      );
    else if (typeof n == "object")
      for (const [o, s] of p(n)) {
        const f = `${e}${o.map((l) => `[${l}]`).join("")}`;
        s === null ? t.push(encodeURIComponent(f)) : t.push(
          `${encodeURIComponent(f)}=${encodeURIComponent(s)}`
        );
      }
    else
      t.push(`${encodeURIComponent(e)}=${encodeURIComponent(n)}`);
  }
  return t;
}
function A(r, t = "&") {
  return j(r).join(t);
}
function M(r) {
  throw r;
}
function E(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var I = function(t) {
  return U(t) && !C(t);
};
function U(r) {
  return !!r && typeof r == "object";
}
function C(r) {
  var t = Object.prototype.toString.call(r);
  return t === "[object RegExp]" || t === "[object Date]" || R(r);
}
var $ = typeof Symbol == "function" && Symbol.for, _ = $ ? Symbol.for("react.element") : 60103;
function R(r) {
  return r.$$typeof === _;
}
function x(r) {
  return Array.isArray(r) ? [] : {};
}
function a(r, t) {
  return t.clone !== !1 && t.isMergeableObject(r) ? c(x(r), r, t) : r;
}
function T(r, t, e) {
  return r.concat(t).map(function(n) {
    return a(n, e);
  });
}
function F(r, t) {
  if (!t.customMerge)
    return c;
  var e = t.customMerge(r);
  return typeof e == "function" ? e : c;
}
function N(r) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r).filter(function(t) {
    return Object.propertyIsEnumerable.call(r, t);
  }) : [];
}
function g(r) {
  return Object.keys(r).concat(N(r));
}
function d(r, t) {
  try {
    return t in r;
  } catch {
    return !1;
  }
}
function D(r, t) {
  return d(r, t) && !(Object.hasOwnProperty.call(r, t) && Object.propertyIsEnumerable.call(r, t));
}
function L(r, t, e) {
  var n = {};
  return e.isMergeableObject(r) && g(r).forEach(function(o) {
    n[o] = a(r[o], e);
  }), g(t).forEach(function(o) {
    D(r, o) || (d(r, o) && e.isMergeableObject(t[o]) ? n[o] = F(o, e)(r[o], t[o], e) : n[o] = a(t[o], e));
  }), n;
}
function c(r, t, e) {
  e = e || {}, e.arrayMerge = e.arrayMerge || T, e.isMergeableObject = e.isMergeableObject || I, e.cloneUnlessOtherwiseSpecified = a;
  var n = Array.isArray(t), o = Array.isArray(r), s = n === o;
  return s ? n ? e.arrayMerge(r, t, e) : L(r, t, e) : a(t, e);
}
c.all = function(t, e) {
  if (!Array.isArray(t))
    throw new Error("first argument should be an array");
  return t.reduce(function(n, o) {
    return c(n, o, e);
  }, {});
};
var v = c, H = v;
const B = /* @__PURE__ */ E(H);
class u {
  constructor(t = {}) {
    const e = typeof t == "string" ? S(t) : t ?? {};
    Object.assign(this, e);
  }
  getParams() {
    return Object.fromEntries(Object.entries(this));
  }
  hasParam(t, ...e) {
    return this.getParam(t, ...e) !== void 0;
  }
  getParam(t, ...e) {
    let n = this.getParams()[t];
    for (const o of e)
      n = n == null ? void 0 : n[o];
    return n;
  }
  withParam(t, e, n = !0) {
    const o = {};
    return o[t] = e, this.withParams(o, n);
  }
  withParams(t, e = !0) {
    return e ? new u(B(this.getParams(), t)) : new u({ ...this.getParams(), ...t });
  }
  withoutParam(t, ...e) {
    const n = { ...this.getParams() };
    let o = n;
    for (e = [t, ...e]; e.length > 1; )
      o = o == null ? void 0 : o[t], t = e.pop();
    return Array.isArray(o) ? o.splice(t, 1) : o == null || delete o[t], new u(n);
  }
  toString() {
    return A(this.getParams());
  }
  toJSON() {
    return this.getParams();
  }
}
const Y = (r = {}) => new u(r), m = "http://localhost";
function J(r) {
  return typeof r == "string" || typeof r == "object" && (r == null ? void 0 : r.toString()) !== "[object Object]";
}
class i {
  constructor(t = "/") {
    h(this, "absolute", !1);
    h(this, "url");
    J(t) || M(new TypeError("Expected string, got " + typeof t));
    try {
      this.url = new URL(t.toString()), this.absolute = !0;
    } catch {
      this.url = new URL(
        m + (t.toString().indexOf("/") === 0 ? "" : "/") + t
      ), this.absolute = !1;
    }
  }
  getScheme() {
    return this.absolute ? this.url.protocol.substring(0, this.url.protocol.indexOf(":")) : "";
  }
  getUserInfo() {
    if (!this.absolute || this.url.username.length === 0 && this.url.password.length === 0)
      return "";
    let t = this.url.username;
    return this.url.password.length !== 0 && (t = t + ":" + this.url.password), t;
  }
  getHost() {
    return this.absolute ? this.url.hostname : "";
  }
  getPort() {
    return this.url.port.length === 0 ? null : parseInt(this.url.port);
  }
  getPath() {
    return this.url.pathname;
  }
  getQuery(t = !1) {
    let e = this.url.search.substring(1);
    return t ? new u(e) : e;
  }
  getFragment() {
    return this.url.hash.substring(1);
  }
  toString() {
    const t = this.url.toString();
    return this.absolute ? t : t.substring(m.length);
  }
  withScheme(t) {
    let e = new i(this.url.toString());
    return e.url.protocol = t.toString(), e;
  }
  withUserInfo(t, e = "") {
    let n = new i(this.url.toString());
    return n.url.username = (t == null ? void 0 : t.toString()) ?? "", n.url.password = (e == null ? void 0 : e.toString()) ?? "", n;
  }
  withHost(t) {
    let e = new i(this.url.toString());
    return e.url.hostname = t.toString(), e;
  }
  withPort(t) {
    let e = new i(this.url.toString());
    return e.url.port = `${t}`, e;
  }
  withPath(t) {
    let e = new i(this.url.toString());
    return e.url.pathname = (t == null ? void 0 : t.toString()) ?? "/", e.absolute = this.absolute, e;
  }
  withQuery(t) {
    let e = new i(this.url.toString());
    return e.url.search = (t == null ? void 0 : t.toString()) ?? "", e.absolute = this.absolute, e;
  }
  withFragment(t) {
    let e = new i(this.url.toString());
    return e.url.hash = (t == null ? void 0 : t.toString()) ?? "", e.absolute = this.absolute, e;
  }
}
const z = (r = "/") => new i(r);
export {
  u as QueryString,
  i as URI,
  Y as query_string,
  z as uri
};
