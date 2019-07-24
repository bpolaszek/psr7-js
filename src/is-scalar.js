export default (value) => {
    return (/boolean|number|string/).test(typeof value)
}
