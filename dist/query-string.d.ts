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
