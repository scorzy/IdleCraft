import equal from 'react-fast-compare'

interface Cache {
    v?: unknown
    set: (k: unknown, other: Cache) => void
    get: (k: unknown) => Cache | undefined
}

const makeCache: () => Cache = () => {
    const m = new Map<unknown, Cache>()
    const w = new WeakMap<object, Cache>()

    const set = (k: unknown, other: Cache) => {
        if (k && typeof k === 'object') w.set(k, other)
        else {
            if (m.size > 100) m.clear()
            m.set(k, other)
        }
    }
    const get = (k: unknown) => {
        if (k && typeof k === 'object') return w.get(k)
        else return m.get(k)
    }

    return { set, get }
}

export function myMemoize<T>(fn: T) {
    const cache = makeCache()
    const results: unknown[] = []

    const ret = (...args: unknown[]) => {
        let level = cache
        let found = true
        let i = 0
        const len = args.length
        let arg1
        for (i = 0; i < len; i++) {
            arg1 = args[i]
            const newLevel = level.get(arg1)
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
            let lastLevel: Cache = makeCache()
            lastLevel.v = res

            for (let k = len - 1; k > i; k--) {
                const arg = args[k]
                const oldLast = lastLevel
                lastLevel = makeCache()
                lastLevel.set(arg, oldLast)
            }

            level.set(arg1, lastLevel)

            return res
        }
    }

    return ret as T
}
