export default function extract_path(key) {
    if (-1 === key.indexOf('[')) {
        return [key];
    }

    const path = key.split('[')[0];
    const segments = key.match(/\[(.*?)\]/g).map(match => {
        const word = match.substr(1).substr(0, match.length - 2);
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
