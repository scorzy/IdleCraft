import { memoize } from 'micro-memoize'

const options = { maxSize: 30 }

export function myMemoize<T>(fn: T): T {
    return memoize(fn as (...args: unknown[]) => unknown, options) as T
}
