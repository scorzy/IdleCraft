import { describe, test, expect } from 'vitest'
import { getFormatter } from './formatNumber'
import { NotationTypes } from './NotationTypes'
import { CommaTypes } from './CommaTypes'

describe('number formatting', () => {
    test('format standard', () => {
        const [format, parse] = getFormatter(NotationTypes.STANDARD, CommaTypes.IT)
        const str = format(10)
        const str1 = format(1.234567945e4)
        const str2 = format(-5)
        const str3 = format(2e300)

        expect(str).toBe('10')
        expect(str1).toBe('12,34K')
        expect(str2).toBe('-5')
        expect(str3).toBe('2E300')

        expect(parse('10')).toBe(10)
        expect(parse('12,34K')).toBe(12.34e3)
        expect(parse('-5')).toBe(-5)
        expect(parse('10k')).toBe(10000)
        expect(parse('2E300')).toBe(2e300)
    })

    test('format scientific', () => {
        const [format, parse] = getFormatter(NotationTypes.SCIENTIFIC, CommaTypes.IT)
        const str = format(10)
        const str1 = format(1.234567945e4)
        const str2 = format(-5)
        const str3 = format(2e300)

        expect(str).toBe('10')
        expect(str1).toBe('1,234E4')
        expect(str2).toBe('-5')
        expect(str3).toBe('2E300')

        expect(parse('10')).toBe(10)
        expect(parse('1,234E4')).toBe(1.234e4)
        expect(parse('-5')).toBe(-5)
        expect(parse('2E300')).toBe(2e300)
    })

    test('format engineering', () => {
        const [format, parse] = getFormatter(NotationTypes.ENGINEERING, CommaTypes.IT)
        const str = format(10)
        const str1 = format(1.234567945e4)
        const str2 = format(-5)
        const str3 = format(2e300)

        expect(str).toBe('10')
        expect(str1).toBe('12,34E3')
        expect(str2).toBe('-5')
        expect(str3).toBe('2E300')

        expect(parse('10')).toBe(10)
        expect(parse('12,34E3')).toBe(12.34e3)
        expect(parse('-5')).toBe(-5)
        expect(parse('2E300')).toBe(2e300)
    })
})
