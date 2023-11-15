import { test, describe, expect } from 'vitest'
import { memoizeOne } from './memoizeOne'

describe('memoizeOne', () => {
    test('memoizeOne 0', () => {
        const fn = () => ({ r: 10 })

        const memoized = memoizeOne(fn)

        expect(fn()).toEqual({ r: 10 })
        expect(memoized()).toEqual({ r: 10 })
        expect(memoized()).toBe(memoized())
    })
    test('memoize 1', () => {
        const fn = (a: number) => a

        const memoized = memoizeOne(fn)

        expect(fn(1)).toBe(1)
        expect(memoized(1)).toBe(1)
    })
})
