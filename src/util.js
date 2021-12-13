function lvd(s1, s2) {
    if (s1 === "") { return s2.length }
    if (s2 === "") { return s1.length }
    if (s1[0] === s2[0]) { return lvd(s1.slice(1), s2.slice(1)) }
    let add = lvd(s1.slice(0), s2.slice(1))
    let del = lvd(s1.slice(1), s2.slice(0))
    let swap = lvd(s1.slice(1), s2.slice(1))
    return 1 + Math.min(add, del, swap)
}
export function fuzKey(dict, key, threshold) {
    if (key in dict) {
        return key
    }
    let min = Number.MAX_SAFE_INTEGER
    let result = null
    for (const k in dict) {
        let lv = (lvd(key, k) * 1.0) / key.length
        if (lv < min && lv <= threshold) {
            result = k
            min = lv
        }
    }
    if (result !== null) {
        return result
    }
    return key
}