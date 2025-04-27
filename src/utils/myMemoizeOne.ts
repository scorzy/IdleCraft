import moize from 'moize'
import { deepEqual } from 'fast-equals'

const options = {
    maxSize: 1,
}

export function myMemoizeOne<T>(fn: T): T {
    let lastResult: unknown = undefined
    const ret = (...args: unknown[]) => {
        const result = moize(fn as (...args: unknown[]) => unknown, options)(...args)
        if (!deepEqual(result, lastResult)) lastResult = result
        return lastResult
    }

    return ret as T
}
