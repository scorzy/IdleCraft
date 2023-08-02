import equal from 'react-fast-compare'

export function memoizeOne<T>(fn: T) {
    let lastVal: unknown
    let params: unknown[] = []

    const ret = (...args: unknown[]) => {
        const len = args.length
        let equalParams = len === params.length

        if (equalParams) {
            for (let i = 0; i < len; i++) {
                if (args[i] !== params[i]) {
                    equalParams = false
                    break
                }
            }
        }

        if (equalParams) return lastVal

        const newVal = (fn as (...args: unknown[]) => unknown)(...args)
        if (!equal(lastVal, newVal)) lastVal = newVal
        params = args
        return lastVal
    }

    return ret as T
}
