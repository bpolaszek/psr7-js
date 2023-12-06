function is_scalar(value: any): boolean {
  return (/boolean|number|string/).test(typeof value)
}

function extract_path(key: string) {
  if (-1 === key.indexOf('[')) {
    return [key];
  }

  const path = key.split('[')[0];
  // @ts-ignore
  const segments = key.match(/\[(.*?)\]/g).map(match => {
    const word = match.substring(1).substr(0, match.length - 2);
    return word.length !== 0 ? decodeURIComponent(word) : null;
  });

  if ('' === path) {
    return segments;
  }

  return [
    decodeURIComponent(path),
    ...segments
  ];
}

function hydrate(segments: Array<string|null>, value: any, obj: any) {
  const key = segments.shift() as string
  const next = [...segments].shift()

  if (undefined === next) {
    obj[key] = value
  } else if (null === next) {
    obj[key] = obj[key] ?? []
    obj[key].push(value)
  } else {
    obj[key] = obj[key] ?? {}
    obj[key] = hydrate(segments, value, obj[key])
  }

  return obj;
}

// @ts-ignore
function* browse_until_I_get_a_scalar(obj, subKeys: Array<string> = []) {
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    if (is_scalar(value) || null === value) {
      yield [[...subKeys, key], value]
    } else {
      yield* browse_until_I_get_a_scalar(value, [...subKeys, key])
    }
  }
}

export function parse_query_string(queryString: string, delimiter: string = '&'): any {
  if (0 === queryString.indexOf('?')) {
    queryString = queryString.substring(1);
  }

  queryString = decodeURI(queryString)

  let segments = queryString.split(delimiter);
  const output = {};
  for (const segment of segments) {
    let operatorPosition = segment.indexOf('=');
    if (-1 === operatorPosition) {
      operatorPosition = segment.length
    }
    const keyParts = extract_path(segment.substring(0, operatorPosition))
    let valuePart = operatorPosition === segment.length ? null : segment.substring(operatorPosition + 1)

    if ('string' === typeof valuePart) {
      valuePart = decodeURIComponent(valuePart)
    }

    hydrate(keyParts, valuePart, output);
  }

  return output
}

function render_query_string_pairs(qs: any, pairs: Array<string> = []): Array<string> {
  for (const key of Object.keys(qs)) {
    const value = qs[key];
    if (null === value) {
      pairs.push(`${encodeURIComponent(key)}`)
    } else if (Array.isArray(value)) {
      pairs.push(...value.map(value => `${encodeURIComponent(key)}%5B%5D=${encodeURIComponent(value)}`))
    } else if ('object' === typeof value) {
      for (const [segments, _value] of browse_until_I_get_a_scalar(value)) {
        const keyPart = `${key}${segments.map((key: string) => `[${key}]`).join('')}`;
        if (null === _value) {
          pairs.push(encodeURIComponent(keyPart));
        } else {
          pairs.push(`${encodeURIComponent(keyPart)}=${encodeURIComponent(_value)}`);
        }
      }
    } else {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    }
  }

  return pairs
}

export function render_query_string(qs: any, delimiter = '&'): string {
  return render_query_string_pairs(qs).join(delimiter)
}


export function die(err: Error): never {
  throw err
}
