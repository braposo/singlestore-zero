export function getKeyByValue(object, value) {
    return Object.keys(object).find(
        (key) =>
            String(object[key]).toLowerCase() === String(value).toLowerCase()
    );
}
