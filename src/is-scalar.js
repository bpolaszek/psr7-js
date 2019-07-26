export default function is_scalar(value) {
    return (/boolean|number|string/).test(typeof value)
}
