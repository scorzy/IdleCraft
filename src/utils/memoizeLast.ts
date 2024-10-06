import equal from 'react-fast-compare'

export function myMemoizeLast<T>(fn: T) {
    let lastVal: unknown

    const ret = (...args: unknown[]) => {
        const newVal = (fn as (...args: unknown[]) => unknown)(...args)
        if (!equal(lastVal, newVal)) lastVal = newVal
        return lastVal
    }

    return ret as T
}
