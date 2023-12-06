export declare class QueryString {
    constructor(queryString?: any);
    getParams(): any;
    hasParam(key: string, ...subKeys: Array<string>): boolean;
    getParam(key: string, ...subKeys: Array<string>): any;
    withParam(key: string, value: any, deepMerge?: boolean): QueryString;
    withParams(params: object, deepMerge?: boolean): QueryString;
    withoutParam(key: string, ...subKeys: Array<string | number>): QueryString;
    toString(): string;
    toJSON(): object;
}
export declare const query_string: (queryString?: any | string) => QueryString;
type Stringable = string | {
    toString(): string;
};
export declare class URI {
    private absolute;
    private url;
    constructor(url?: Stringable);
    getScheme(): string;
    getUserInfo(): string;
    getHost(): string;
    getPort(): number | null;
    getPath(): string;
    getQuery(asObject?: boolean): string | QueryString;
    getFragment(): string;
    toString(): string;
    withScheme(scheme: Stringable): URI;
    withUserInfo(username: Stringable | null, password?: Stringable | null): URI;
    withHost(host: Stringable): URI;
    withPort(port: number): URI;
    withPath(path: Stringable | null): URI;
    withQuery(query: Stringable | null): URI;
    withFragment(fragment: Stringable | null): URI;
}
export declare const uri: (uri?: Stringable) => URI;
export {};
