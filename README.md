[![Latest Stable Version](https://img.shields.io/npm/v/psr7-js?style=flat-square)](https://www.npmjs.com/package/psr7-js)
[![License](https://img.shields.io/npm/l/psr7-js?style=flat-square)](https://www.npmjs.com/package/psr7-js)
![CI Workflow](https://github.com/bpolaszek/psr7-js/workflows/CI%20Workflow/badge.svg)
[![Coverage Status](https://img.shields.io/coveralls/github/bpolaszek/psr7-js?style=flat-square)](https://coveralls.io/github/bpolaszek/psr7-js?branch=master)
[![Total Downloads](https://img.shields.io/npm/dt/psr7-js?style=flat-square)](https://www.npmjs.com/package/psr7-js)

# PSR7-JS

## URI

Coming from the PHP World, you probably use [PSR-7 UriInterface](https://www.php-fig.org/psr/psr-7/#35-psrhttpmessageuriinterface) almost every day to manipulate URIs.

But what if you come to front-end development? You can use native `URL` objects, which are mutable, have no fluent setters and different property names. And only absolute URLs are supported.

So, this library is intended to expose the same methods as PSR-7, in an immutable way:

```javascript
import {URI} from 'psr7-js';

let uri = new URI('/foo'); // Relative URLs are supported - Defaults to window.location.href
uri = uri.withQuery('foo=bar');

console.log(uri.toString()); // /foo?foo=bar
```

## QueryString

Query Strings aren't part of the PSR-7 specification, but there are still issues when dealing with complex query strings in Javascript.

There are lots of query string manipulation libraries on NPM packages, but I couldn't find one which properly handles PHP's array syntax (sequential and/or associative).

```javascript
import {QueryString} from 'psr7-js';

let qs = new QueryString('?foo=bar'); // Accepts strings (leading ? is ignored) or objects - Defaults to window.location.search
qs = qs.withParam('bar', 'baz'); // foo=bar&bar=baz
qs = qs.withoutParam('bar'); // foo=bar
qs = qs.withParam('foos', ['foo', 'bar']); // foo=bar&foos[]=foo&foos[]=bar
qs = qs.withParam('sort', {'updated_at': 'desc', 'hits': 'desc'}); // foo=bar&foos[]=foo&foos[]=bar&sort[updated_at]=desc&hits=desc
qs = qs.withoutParam('sort', 'hits'); // foo=bar&foos[]=foo&foos[]=bar&sort[updated_at]=desc

console.log(qs.getParams());

/*
{
  "foo": "bar",
  "foos": [
    "foo",
    "bar"
  ],
  "sort": {
    "updated_at": "desc"
  }
}
 */

console.log(qs.toString()); // foo=bar&foos[]=foo&foos[]=bar&sort[updated_at]=desc
```

Inspired by [bentools/querystring](https://github.com/bpolaszek/querystring).

## Tests

```bash
yarn test // or npm run-script test
```

## License

MIT.
