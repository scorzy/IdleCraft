import { test, describe, expect, vi } from 'vitest'
import { memoize } from './memoize'

describe('memoize', () => {
    test('memoize 0', () => {
        const fn = () => ({ r: 10 })

        const memoized = memoize<typeof fn>(fn)

        expect(fn()).toEqual({ r: 10 })
        expect(memoized()).toEqual({ r: 10 })
        expect(memoized()).toBe(memoized())
    })
    test('memoize 1', () => {
        const fn = (a: number) => a

        const memoized = memoize<typeof fn>(fn)

        expect(fn(1)).toBe(1)
        expect(memoized(1)).toBe(1)
    })

    test('memoize 2', () => {
        const fn = vi.fn().mockImplementation((a: number, b: string) => a.toString() + b)

        const memoized = memoize<typeof fn>(fn)

        expect(fn(1, 'a')).toBe('1a')
        expect(memoized(1, 'a')).toBe('1a')
        expect(memoized(1, 'a')).toBe('1a')
        expect(fn).toHaveBeenCalledTimes(2)
    })

    test('memoize 3', () => {
        const fn = vi.fn().mockImplementation((a: number, b: string, c: string) => ({
            res: a.toString() + b + c,
        }))

        const memoized = memoize<typeof fn>(fn)

        expect(memoized(2, 'a', 'c')).toBe(memoized(2, 'a', 'c'))
        expect(memoized(2, 'a', 'c')).toBe(memoized(2, 'a', 'c'))
        expect(memoized(2, 'a', 'c')).toBe(memoized(2, 'a', 'c'))
        expect(fn).toHaveBeenCalledTimes(1)
    })
    test('memoize 3', () => {
        const fn = (a: number, b: string, c: string, d: { d: string }) => ({
            res: a.toString() + b + c + d.d,
        })

        const memoized = memoize<typeof fn>(fn)
        const d = { d: 'd' }
        const d2 = { d: '2' }
        const res1 = memoized(2, 'a', 'c', d)
        expect(res1).toBe(memoized(2, 'a', 'c', d))
        expect(memoized(2, 'a', 'c', d2)).toBe(memoized(2, 'a', 'c', d2))
        expect(res1).toBe(memoized(2, 'a', 'c', d))
    })

    test('memoize optional', () => {
        const fn = (a: number, b: string, c = 'CC', d: { d: string } = { d: 'A' }) => ({
            res: a.toString() + b + c + d.d,
        })

        const memoized = memoize<typeof fn>(fn)
        const d = { d: 'd' }
        const res1 = memoized(2, 'a', 'c', d)
        const res2 = memoized(2, 'a', 'c')
        const res3 = memoized(2, 'a')

        expect(res1).toBe(memoized(2, 'a', 'c', d))
        expect(res2).toBe(memoized(2, 'a', 'c'))
        expect(res3).toBe(memoized(2, 'a'))

        expect(res1).toEqual({ res: '2acd' })
        expect(res2).toEqual({ res: '2acA' })
        expect(res3).toEqual({ res: '2aCCA' })
    })
    test('memoize optional no val', () => {
        const fn = (a: number, b: string, c = 'CC', d?: { d: string }) => ({
            res: a.toString() + b + c + (d?.d ?? '--'),
        })

        const memoized = memoize<typeof fn>(fn)
        const d = { d: 'd' }
        const res1 = memoized(2, 'a', 'c', d)
        const res2 = memoized(2, 'a', 'c')
        const res3 = memoized(2, 'a')

        expect(res1).toBe(memoized(2, 'a', 'c', d))
        expect(res2).toBe(memoized(2, 'a', 'c'))
        expect(res3).toBe(memoized(2, 'a'))

        expect(res1).toEqual({ res: '2acd' })
        expect(res2).toEqual({ res: '2ac--' })
        expect(res3).toEqual({ res: '2aCC--' })
    })
    test('memoize size', () => {
        const fn = (a: number, b: string) => ({
            res: a.toString() + b,
        })

        const memoized = memoize<typeof fn>(fn)

        const res1 = memoized(-1, 'a')
        const res2 = memoized(2, 'a')

        for (let i = 0; i < 20; i++) memoized(i, 'a')

        expect(res1).not.toBe(memoized(-1, 'a'))
        expect(res2).not.toBe(memoized(2, 'a'))
    })
    test('memoize null', () => {
        const fn = (a: number | null, b: string | null) => ({
            res: (a?.toString() ?? 'null') + (b ?? '_null'),
        })

        const memoized = memoize<typeof fn>(fn)

        const res1 = memoized(1, 'a')
        const res2 = memoized(null, '_a')
        const res3 = memoized(null, null)

        expect(memoized(1, 'a')).toEqual({ res: '1a' })
        expect(memoized(null, '_a')).toEqual({ res: 'null_a' })
        expect(memoized(null, null)).toEqual({ res: 'null_null' })

        expect(res1).toBe(memoized(1, 'a'))
        expect(res2).toBe(memoized(null, '_a'))
        expect(res3).toBe(memoized(null, null))
    })
    test('memoize undefined', () => {
        const fn = (a: number | undefined, b: string | undefined) => ({
            res: (a?.toString() ?? 'null') + (b ?? '_null'),
        })

        const memoized = memoize<typeof fn>(fn)

        const res1 = memoized(1, 'a')
        const res2 = memoized(undefined, '_a')
        const res3 = memoized(undefined, undefined)

        expect(memoized(1, 'a')).toEqual({ res: '1a' })
        expect(memoized(undefined, '_a')).toEqual({ res: 'null_a' })
        expect(memoized(undefined, undefined)).toEqual({ res: 'null_null' })

        expect(res1).toBe(memoized(1, 'a'))
        expect(res2).toBe(memoized(undefined, '_a'))
        expect(res3).toBe(memoized(undefined, undefined))
    })
})
