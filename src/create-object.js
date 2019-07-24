import cast from "./cast";

export default function create_object(path, value) {
    const obj = {};

    let current, previous, next;
    let cursor = obj;

    for (let i = 0; i < path.length; i++) {
        current = path[i];
        previous = path[i - 1];
        next = path[i + 1];

        if (undefined === next) {
            if (Array.isArray(cursor)) {
                cursor.push(value);
                break;
            }
            cursor[current] = cast(value);
            break;
        }

        if (Array.isArray(cursor)) {
            cursor.push(create_object(path.slice(i + 1, path.length), value));
            break;
        }

        cursor[current] = null === next ? [] : {};
        cursor = cursor[current];
    }

    return obj;
}
;
