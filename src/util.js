export function lvd_original(s1, s2) {
    if (s1 === "") { return s2.length }
    if (s2 === "") { return s1.length }
    if (s1[0] === s2[0]) { return lvd(s1.slice(1), s2.slice(1)) }
    let add = lvd(s1.slice(0), s2.slice(1))
    let del = lvd(s1.slice(1), s2.slice(0))
    let swap = lvd(s1.slice(1), s2.slice(1))
    return 1 + Math.min(add, del, swap)
}

// Memoization
export function lvd(s1, s2) {
    let dp = Array.from(new Array(s1.length + 1), _ => new Array(s2.length + 1).fill(0));

    for (let i = 0; i <= s1.length; i++) {
        for (let j = 0; j <= s2.length; j++) {
            if (i == 0) {
                dp[i][j] = j;
            }
            else if (j == 0) {
                dp[i][j] = i;
            }
            else {
                dp[i][j] = Math.min(dp[i - 1][j - 1]
                    + (s1.charAt(i - 1) == s2.charAt(j - 1) ? 0 : 1),
                    dp[i - 1][j] + 1,
                    dp[i][j - 1] + 1);
            }
        }
    }
    return dp[s1.length][s2.length];
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