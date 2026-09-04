import { deepEqual } from 'fast-equals'

export function myMemoizeOne<T>(fn: T): T {
    let lastResult: unknown = undefined
    const ret = (...args: unknown[]) => {
        const result = (fn as (...args: unknown[]) => unknown)(...args)
        try {
            if (!deepEqual(result, lastResult)) lastResult = result
        } catch {
            // A result calculated during a mutative update can be a revoked draft by the next invocation.
            lastResult = result
        }
        return lastResult
    }

    return ret as T
}
