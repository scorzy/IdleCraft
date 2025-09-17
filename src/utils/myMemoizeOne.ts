import { deepEqual } from 'fast-equals'

export function myMemoizeOne<T>(fn: T): T {
    let lastResult: unknown = undefined
    const ret = (...args: unknown[]) => {
        const result = (fn as (...args: unknown[]) => unknown)(...args)
        if (!deepEqual(result, lastResult)) lastResult = result
        return lastResult
    }

    return ret as T
}
