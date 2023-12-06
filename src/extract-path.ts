export default function extract_path(key: string): Array<string|null> {
    if (-1 === key.indexOf('[')) {
        return [key];
    }

    const path = key.split('[')[0];
    // @ts-ignore
    const segments = key.match(/\[(.*?)\]/g).map(match => {
        const word = match.substring(1).substr(0, match.length - 2);
        return word.length !== 0 ? word : null;
    });

    if ('' === path) {
        return segments;
    }

    return [
        path,
        ...segments
    ];
}

export function hydrate(segments: Array<string|null>, value: any, obj: any) {
    const key = segments.shift() as string
    const next = [...segments].shift()

    if (undefined === next) {
        obj[key] = value
    } else if (null === next) {
        obj[key] = obj[key] ?? []
        obj[key].push(value)
    } else {
        obj[key] = hydrate(segments, value, {})
    }

    return obj;
}
