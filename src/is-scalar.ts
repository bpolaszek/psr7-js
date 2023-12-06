export default function is_scalar(value: any): boolean {
    return (/boolean|number|string/).test(typeof value)
}
