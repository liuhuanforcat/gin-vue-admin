//移除对象中，值为空的属性
export function removeEmptyProperties(obj) {
    return Object.entries(obj)
        .filter(([_, value]) => value !== null && value !== undefined && value !== '' && (!Array.isArray(value) || value.length > 0))
        .reduce(
            (acc, [key, value]) => ({
                ...acc,
                [key]: value instanceof Object && !Array.isArray(value) ? removeEmptyProperties(value) : value
            }),
            {}
        );
}
//将对象贴到get请求上
export function objectToQueryString(params) {
    return new URLSearchParams(params).toString();
}