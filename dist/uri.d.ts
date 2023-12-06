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
    getQuery(): string;
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
export {};
