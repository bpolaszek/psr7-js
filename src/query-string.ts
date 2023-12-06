import { parse_query_string, render_query_string } from './utils.ts';
import merge from 'deepmerge';

export class QueryString {

  private readonly params: any;

  constructor(queryString: any = {}) {
    this.params = 'string' === typeof queryString ? parse_query_string(queryString) : queryString ?? {};
  }

  getParams(): object {
    return this.params;
  }

  hasParam(key: string, ...subKeys: Array<string>): boolean {
    return undefined !== this.getParam(key, ...subKeys);
  }

  getParam(key: string, ...subKeys: Array<string>): any {
    let value = this.params[key];
    for (const element of subKeys) {
      value = value?.[element];
    }
    return value;
  }

  withParam(key: string, value: any, deepMerge = true) {

    const params: any = {};
    params[key] = value;

    return this.withParams(params, deepMerge);
  }

  withParams(params: object, deepMerge = true) {
    if (!deepMerge) {
      return new QueryString({...this.params, ...params});
    }

    return new QueryString(merge(this.params, params));
  }

  withoutParam(key: string, ...subKeys: Array<string|number>): QueryString {
    const params = {...this.params};
    let current = params;
    subKeys = [key, ...subKeys];
    while (subKeys.length > 1) {
      current = current?.[key]
      key = subKeys.pop() as string;
    }

    if (Array.isArray(current)) {
      // @ts-ignore
      current.splice(key, 1)
    } else {
      delete current?.[key];
    }

    return new QueryString(params);
  }

  toString(): string {
    return render_query_string(this.params);
  }

  toJSON(): object {
    return this.params;
  }

}
