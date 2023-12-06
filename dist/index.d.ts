import * as UriModule from "./uri.ts";
import * as QueryStringModule from "./query-string.ts";
export declare const URI: typeof UriModule.URI;
export declare const uri: (uri?: string | {
    toString(): string;
}) => UriModule.URI;
export declare const QueryString: typeof QueryStringModule.QueryString;
export declare const query_string: (queryString?: any) => QueryStringModule.QueryString;
