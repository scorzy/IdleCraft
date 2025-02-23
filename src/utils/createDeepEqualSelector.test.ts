import { assert } from 'console'
import { test, describe } from 'vitest'
import { createDeepEqualSelector } from './createDeepEqualSelector'

describe('createDeepEqualSelector', () => {
    test('deep equal', () => {
        const fn = (param: { a: number }) => ({ r: param.a })

        const selector = createDeepEqualSelector([fn], (a) => a)
        assert(selector({ a: 1 }) === selector({ a: 1 }))
    })
})
