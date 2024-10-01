import equal from 'react-fast-compare'

interface Cache {
    m?: Map<unknown, Cache>
    v?: unknown
}

export function memoize<T>(fn: T) {
    const cache: Cache = {}
    const results: unknown[] = []

    const ret = (...args: unknown[]) => {
        let level = cache
        let found = true
        let i = 0
        const len = args.length
        let arg1
        for (i = 0; i < len; i++) {
            arg1 = args[i]
            const newLevel = level.m?.get(arg1)
            if (newLevel) level = newLevel
            else {
                found = false
                break
            }
        }

        const getResult = () => {
            const result = (fn as (...args: unknown[]) => unknown)(...args)
            for (const r of results) if (equal(r, result)) return r
            results.push(result)
            if (results.length > 100) results.shift()
            return result
        }

        if (found) {
            if (!level.v) level.v = getResult()
            return level.v
        } else {
            const res = getResult()
            let lastLevel: Cache = { v: res }

            for (let k = len - 1; k > i; k--) {
                const arg = args[k]
                const m = new Map<unknown, Cache>()
                m.set(arg, lastLevel)
                lastLevel = { m }
            }

            let map = level.m
            if (!map) {
                map = new Map<unknown, Cache>()
                level.m = map
                map.set(arg1, lastLevel)
            } else {
                map.set(arg1, lastLevel)
                if (map.size > 20) map.delete(map.keys().next().value)
            }

            return res
        }
    }

    return ret as T
}
