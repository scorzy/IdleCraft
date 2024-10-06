import { test, describe, expect } from 'vitest'
import { myMemoizeOne } from './memoizeOne'

describe('memoizeOne', () => {
    test('memoizeOne 0', () => {
        const fn = () => ({ r: 10 })

        const memoized = myMemoizeOne(fn)

        expect(fn()).toEqual({ r: 10 })
        expect(memoized()).toEqual({ r: 10 })
        expect(memoized()).toBe(memoized())
    })
    test('memoize 1', () => {
        const fn = (a: number) => a

        const memoized = myMemoizeOne(fn)

        expect(fn(1)).toBe(1)
        expect(memoized(1)).toBe(1)
    })
})
