import { describe, expect, test } from 'vitest'
import { getCharLevel, getCharLevelExp } from './expSelectors'

describe('Exp Selectors', () => {
    test('getCharLevel', () => {
        expect(getCharLevel(0)).toEqual(0)
        expect(getCharLevel(9999)).toEqual(0)
        expect(getCharLevel(10000)).toEqual(1)
        expect(getCharLevel(22000)).toEqual(2)

        expect(getCharLevelExp(0)).toEqual(0)
        expect(getCharLevelExp(1)).toEqual(10000)
        expect(getCharLevelExp(2)).toEqual(22000)
        expect(getCharLevelExp(3)).toEqual(36400)
    })
    test('Levels', () => {
        for (let level = 1; level < 11; level++) {
            const exp = getCharLevelExp(level)
            const level2 = getCharLevel(exp)

            expect(level, `Level: ${level} ${exp} ${level2}`).toEqual(level2)
        }
    })
})
