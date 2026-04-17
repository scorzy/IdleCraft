import { describe, expect, test } from 'vitest'
import { myMemoizeOne } from './myMemoizeOne'

const fn1 = () => ({ r: 10 })
const fn2 = (a: number) => a

describe('memoizeOne', () => {
    test('memoizeOne 0', () => {
        const memoized = myMemoizeOne(fn1)

        expect(fn1()).toEqual({ r: 10 })
        expect(memoized()).toEqual({ r: 10 })
        expect(memoized()).toBe(memoized())
    })
    test('memoize 1', () => {
        const memoized = myMemoizeOne(fn2)

        expect(fn2(1)).toBe(1)
        expect(memoized(1)).toBe(1)
    })
})
