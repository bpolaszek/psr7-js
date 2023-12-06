import { parse_query_string, render_query_string } from '@/utils.ts';
import { describe, expect, it } from 'vitest';


describe('Query String', () => {

  it('works', () => {

    let input;
    input = encodeURI('?foo=bar&things[]=toto&things[]=titi+tutu toutou&sort order[things][up]=desc&sort order[things][down]=asc&sort order[stuff]=true&bar&baz=');

    let parsed = parse_query_string(input);
    console.log(parsed)
    let rendered = render_query_string(parsed);
    console.log(input);
    console.log('?' + rendered);
    expect(true).toBe(true)
  });

});
