import { assert } from 'console'
import { test, describe } from 'vitest'
import { createDeepEqualSelector } from './createDeepEqualSelector'

describe('createDeepEqualSelector', () => {
    test('deep equal with transformation', () => {
        const fn = (param: { a: number }) => param.a
        const selector = createDeepEqualSelector([fn], (a) => ({ result: a * 2 }))

        const result1 = selector({ a: 1 })
        const result2 = selector({ a: 1 })
        const result3 = selector({ a: 2 })

        assert(result1 === result2) // Memoized result
        assert(result1 !== result3) // Different input, different result
        assert(result1.result === 2)
        assert(result3.result === 4)
    })

    test('multiple input selectors', () => {
        const fn1 = (param: { a: number }) => param.a
        const fn2 = (param: { b: number }) => param.b
        const selector = createDeepEqualSelector([fn1, fn2], (a, b) => ({ sum: a + b }))

        const result1 = selector({ a: 1, b: 2 })
        const result2 = selector({ a: 1, b: 2 })
        const result3 = selector({ a: 2, b: 3 })

        assert(result1 === result2) // Memoized result
        assert(result1 !== result3) // Different input, different result
        assert(result1.sum === 3)
        assert(result3.sum === 5)
    })

    test('handles nested objects', () => {
        const fn = (param: { nested: { value: number } }) => param.nested.value
        const selector = createDeepEqualSelector([fn], (value) => ({ doubled: value * 2 }))

        const result1 = selector({ nested: { value: 3 } })
        const result2 = selector({ nested: { value: 3 } })
        const result3 = selector({ nested: { value: 4 } })

        assert(result1 === result2) // Memoized result
        assert(result1 !== result3) // Different input, different result
        assert(result1.doubled === 6)
        assert(result3.doubled === 8)
    })
})
