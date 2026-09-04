import { create } from 'mutative'
import { describe, expect, it } from 'vitest'
import { myMemoizeOne } from './myMemoizeOne'

describe('myMemoizeOne', () => {
    it('replaces a revoked mutative draft cached by an earlier invocation', () => {
        const memoized = myMemoizeOne((value: { id: string }) => value)
        const value = { id: 'player' }

        create(value, (draft) => {
            memoized(draft)
        })

        expect(() => memoized(value)).not.toThrow()
        expect(memoized(value)).toEqual(value)
    })
})
