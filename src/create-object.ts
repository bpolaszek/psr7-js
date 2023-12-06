import cast from "./cast";

export default function create_object(path: Array<string|null>, value: any) {
  const obj = {};

  // @ts-ignore
  let current: string, previous, next;
  let cursor = obj;

  for (let i = 0; i < path.length; i++) {
    current = path[i];
    previous = path[i - 1];
    next = path[i + 1];

    if ('undefined' === typeof next) {
      if (Array.isArray(cursor)) {
        cursor.push(value);
        break;
      }
      // @ts-ignore
      cursor[current] = cast(value);
      break;
    }

    if (Array.isArray(cursor)) {
      cursor.push(create_object(path.slice(i + 1, path.length), value));
      break;
    }

    // @ts-ignore
    cursor[current] = null === next ? [] : {};
    // @ts-ignore
    cursor = cursor[current];
  }

  return obj;
}
