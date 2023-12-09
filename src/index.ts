import {parse_query_string, render_query_string, die} from './utils.ts'
import merge from 'deepmerge'

export class QueryString {
  constructor(queryString: any = {}) {
    const params = 'string' === typeof queryString ? parse_query_string(queryString) : queryString ?? {}
    Object.assign(this, params)
  }

  getParams(): any {
    return Object.fromEntries(Object.entries(this))
  }

  hasParam(key: string, ...subKeys: Array<string>): boolean {
    return undefined !== this.getParam(key, ...subKeys)
  }

  getParam(key: string, ...subKeys: Array<string>): any {
    let value = this.getParams()[key]
    for (const element of subKeys) {
      value = value?.[element]
    }
    return value
  }

  withParam(key: string, value: any, deepMerge = true) {
    const params: any = {}
    params[key] = value

    return this.withParams(params, deepMerge)
  }

  withParams(params: object, deepMerge = true) {
    if (!deepMerge) {
      return new QueryString({...this.getParams(), ...params})
    }

    return new QueryString(merge(this.getParams(), params))
  }

  withoutParam(key: string, ...subKeys: Array<string | number>): QueryString {
    const params = {...this.getParams()}
    let current = params
    subKeys = [key, ...subKeys]
    while (subKeys.length > 1) {
      current = current?.[key]
      key = subKeys.pop() as string
    }

    if (Array.isArray(current)) {
      // @ts-ignore
      current.splice(key, 1)
    } else {
      delete current?.[key]
    }

    return new QueryString(params)
  }

  toString(): string {
    return render_query_string(this.getParams())
  }

  toJSON(): object {
    return this.getParams()
  }
}

export const query_string = (queryString: any | string = {}) => new QueryString(queryString)

type Stringable = string | {toString(): string}

const placeholder = 'http://localhost'

function isStringable(value: any): boolean {
  return 'string' === typeof value || ('object' === typeof value && '[object Object]' !== value?.toString())
}

export class URI {
  private absolute: boolean = false
  private url: URL

  constructor(url: Stringable = '/') {
    isStringable(url) || die(new TypeError('Expected string, got ' + typeof url))
    try {
      this.url = new URL(url.toString())
      this.absolute = true
    } catch (e) {
      this.url = new URL(placeholder + (0 === url.toString().indexOf('/') ? '' : '/') + url)
      this.absolute = false
    }
  }

  getScheme(): string {
    return !this.absolute ? '' : this.url.protocol.substring(0, this.url.protocol.indexOf(':'))
  }

  getUserInfo() {
    if (!this.absolute) {
      return ''
    }

    if (0 === this.url.username.length && 0 === this.url.password.length) {
      return ''
    }

    let userInfo = this.url.username

    if (0 !== this.url.password.length) {
      userInfo = userInfo + ':' + this.url.password
    }

    return userInfo
  }

  getHost() {
    return !this.absolute ? '' : this.url.hostname
  }

  getPort() {
    return 0 === this.url.port.length ? null : parseInt(this.url.port)
  }

  getPath() {
    return this.url.pathname
  }

  getQuery(asObject: true): QueryString
  getQuery(asObject?: false): string
  getQuery(asObject: boolean = false): QueryString | string {
    let qs = this.url.search.substring(1)
    return asObject ? new QueryString(qs) : qs
  }

  getFragment() {
    return this.url.hash.substring(1)
  }

  toString() {
    const url = this.url.toString()
    if (this.absolute) {
      return url
    }

    return url.substring(placeholder.length)
  }

  withScheme(scheme: Stringable) {
    let clone = new URI(this.url.toString())
    clone.url.protocol = scheme.toString()

    return clone
  }

  withUserInfo(username: Stringable | null, password: Stringable | null = '') {
    let clone = new URI(this.url.toString())
    clone.url.username = username?.toString() ?? ''
    clone.url.password = password?.toString() ?? ''

    return clone
  }

  withHost(host: Stringable) {
    let clone = new URI(this.url.toString())
    clone.url.hostname = host.toString()

    return clone
  }

  withPort(port: number) {
    let clone = new URI(this.url.toString())
    clone.url.port = `${port}`

    return clone
  }

  withPath(path: Stringable | null) {
    let clone = new URI(this.url.toString())
    clone.url.pathname = path?.toString() ?? '/'
    clone.absolute = this.absolute

    return clone
  }

  withQuery(query: Stringable | null) {
    let clone = new URI(this.url.toString())
    clone.url.search = query?.toString() ?? ''
    clone.absolute = this.absolute

    return clone
  }

  withFragment(fragment: Stringable | null) {
    let clone = new URI(this.url.toString())
    clone.url.hash = fragment?.toString() ?? ''
    clone.absolute = this.absolute

    return clone
  }
}

export const uri = (uri: Stringable = '/') => new URI(uri)
