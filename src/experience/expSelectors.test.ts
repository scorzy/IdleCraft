import { describe, expect, test } from 'vitest'
import { getCharLevel, getCharLevelExp } from './expSelectors'

describe('Exp Selectors', () => {
    test('Levels', () => {
        for (let level = 1; level < 7399; level++) {
            const exp = getCharLevelExp(level)
            const level2 = getCharLevel(exp)

            expect(level).toEqual(level2)
        }
    })
})
