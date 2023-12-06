var O = Object.defineProperty;
var S = (r, t, e) => t in r ? O(r, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : r[t] = e;
var h = (r, t, e) => (S(r, typeof t != "symbol" ? t + "" : t, e), e);
function P(r) {
  return /boolean|number|string/.test(typeof r);
}
function I(r) {
  if (r.indexOf("[") === -1)
    return [r];
  const t = r.split("[")[0], e = r.match(/\[(.*?)\]/g).map((n) => {
    const o = n.substring(1).substr(0, n.length - 2);
    return o.length !== 0 ? decodeURIComponent(o) : null;
  });
  return t === "" ? e : [decodeURIComponent(t), ...e];
}
function b(r, t, e) {
  const n = r.shift();
  if (!n.length)
    return e;
  const o = [...r].shift();
  return o === void 0 ? e[n] = t : o === null ? (e[n] = e[n] ?? [], e[n].push(t)) : (e[n] = e[n] ?? {}, e[n] = b(r, t, e[n])), e;
}
function* d(r, t = []) {
  for (const e of Object.keys(r)) {
    const n = r[e];
    P(n) || n === null ? yield [[...t, e], n] : yield* d(n, [...t, e]);
  }
}
function j(r, t = "&") {
  r.indexOf("?") === 0 && (r = r.substring(1)), r = decodeURI(r);
  let e = r.split(t);
  const n = {};
  for (const o of e) {
    let s = o.indexOf("=");
    s === -1 && (s = o.length);
    const a = I(o.substring(0, s));
    let l = s === o.length ? null : o.substring(s + 1);
    typeof l == "string" && (l = decodeURIComponent(l)), b(a, l, n);
  }
  return n;
}
function U(r, t = []) {
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
      for (const [o, s] of d(n)) {
        const a = `${e}${o.map((l) => `[${l}]`).join("")}`;
        s === null ? t.push(encodeURIComponent(a)) : t.push(
          `${encodeURIComponent(a)}=${encodeURIComponent(s)}`
        );
      }
    else
      t.push(`${encodeURIComponent(e)}=${encodeURIComponent(n)}`);
  }
  return t;
}
function R(r, t = "&") {
  return U(r).join(t);
}
function A(r) {
  throw r;
}
function M(r) {
  return r && r.__esModule && Object.prototype.hasOwnProperty.call(r, "default") ? r.default : r;
}
var E = function(t) {
  return $(t) && !C(t);
};
function $(r) {
  return !!r && typeof r == "object";
}
function C(r) {
  var t = Object.prototype.toString.call(r);
  return t === "[object RegExp]" || t === "[object Date]" || T(r);
}
var _ = typeof Symbol == "function" && Symbol.for, x = _ ? Symbol.for("react.element") : 60103;
function T(r) {
  return r.$$typeof === x;
}
function Q(r) {
  return Array.isArray(r) ? [] : {};
}
function c(r, t) {
  return t.clone !== !1 && t.isMergeableObject(r) ? u(Q(r), r, t) : r;
}
function F(r, t, e) {
  return r.concat(t).map(function(n) {
    return c(n, e);
  });
}
function N(r, t) {
  if (!t.customMerge)
    return u;
  var e = t.customMerge(r);
  return typeof e == "function" ? e : u;
}
function D(r) {
  return Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(r).filter(function(t) {
    return Object.propertyIsEnumerable.call(r, t);
  }) : [];
}
function m(r) {
  return Object.keys(r).concat(D(r));
}
function y(r, t) {
  try {
    return t in r;
  } catch {
    return !1;
  }
}
function L(r, t) {
  return y(r, t) && !(Object.hasOwnProperty.call(r, t) && Object.propertyIsEnumerable.call(r, t));
}
function v(r, t, e) {
  var n = {};
  return e.isMergeableObject(r) && m(r).forEach(function(o) {
    n[o] = c(r[o], e);
  }), m(t).forEach(function(o) {
    L(r, o) || (y(r, o) && e.isMergeableObject(t[o]) ? n[o] = N(o, e)(r[o], t[o], e) : n[o] = c(t[o], e));
  }), n;
}
function u(r, t, e) {
  e = e || {}, e.arrayMerge = e.arrayMerge || F, e.isMergeableObject = e.isMergeableObject || E, e.cloneUnlessOtherwiseSpecified = c;
  var n = Array.isArray(t), o = Array.isArray(r), s = n === o;
  return s ? n ? e.arrayMerge(r, t, e) : v(r, t, e) : c(t, e);
}
u.all = function(t, e) {
  if (!Array.isArray(t))
    throw new Error("first argument should be an array");
  return t.reduce(function(n, o) {
    return u(n, o, e);
  }, {});
};
var H = u, B = H;
const J = /* @__PURE__ */ M(B);
let g = class f {
  constructor(t = {}) {
    const e = typeof t == "string" ? j(t) : t ?? {};
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
    return e ? new f(J(this.getParams(), t)) : new f({ ...this.getParams(), ...t });
  }
  withoutParam(t, ...e) {
    const n = { ...this.getParams() };
    let o = n;
    for (e = [t, ...e]; e.length > 1; )
      o = o == null ? void 0 : o[t], t = e.pop();
    return Array.isArray(o) ? o.splice(t, 1) : o == null || delete o[t], new f(n);
  }
  toString() {
    return R(this.getParams());
  }
  toJSON() {
    return this.getParams();
  }
};
const V = (r = {}) => new g(r), p = "http://localhost";
function Y(r) {
  return typeof r == "string" || typeof r == "object" && (r == null ? void 0 : r.toString()) !== "[object Object]";
}
let w = class i {
  constructor(t = "/") {
    h(this, "absolute", !1);
    h(this, "url");
    Y(t) || A(new TypeError("Expected string, got " + typeof t));
    try {
      this.url = new URL(t.toString()), this.absolute = !0;
    } catch {
      this.url = new URL(
        p + (t.toString().indexOf("/") === 0 ? "" : "/") + t
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
    return t ? new g(e) : e;
  }
  getFragment() {
    return this.url.hash.substring(1);
  }
  toString() {
    const t = this.url.toString();
    return this.absolute ? t : t.substring(p.length);
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
};
const z = (r = "/") => new w(r), W = w, X = z, Z = g, K = V;
export {
  Z as QueryString,
  W as URI,
  K as query_string,
  X as uri
};
