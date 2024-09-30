interface Cache {
    m?: Map<unknown, Cache>
    v?: unknown
}

export function memoize<T>(fn: T) {
    const cache: Cache = {}

    const ret = (...args: unknown[]) => {
        let level = cache
        let found = true
        let i = 0
        const len = args.length
        let arg1

        const getKeyArt = (arg: unknown) => {
            const type = typeof getKeyArt
            if (type === 'bigint' || type === 'number' || type === 'string') return arg
            else return JSON.stringify(arg)
        }

        for (i = 0; i < len; i++) {
            arg1 = args[i]
            const newLevel = level.m?.get(getKeyArt(arg1))
            if (newLevel) level = newLevel
            else {
                found = false
                break
            }
        }

        if (found) {
            if (level.v === undefined) level.v = (fn as (...args: unknown[]) => unknown)(...args)
            return level.v
        } else {
            const res = (fn as (...args: unknown[]) => unknown)(...args)
            let lastLevel: Cache = { v: res }

            for (let k = len - 1; k > i; k--) {
                const arg = args[k]
                const m = new Map<unknown, Cache>()
                m.set(getKeyArt(arg), lastLevel)
                lastLevel = { m }
            }

            let map = level.m
            if (map === undefined) {
                map = new Map<unknown, Cache>()
                level.m = map
                map.set(getKeyArt(arg1), lastLevel)
            } else {
                map.set(getKeyArt(arg1), lastLevel)
            }

            return res
        }
    }

    return ret as T
}
