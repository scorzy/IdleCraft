import { describe, it, expect } from 'vitest'
import { removeUnusedParams } from './removeUnusedParams'

describe('removeUnusedParams', () => {
    it('removes a single parameter', () => {
        expect(removeUnusedParams('Hello {user}')).toBe('Hello')
    })

    it('removes multiple parameters', () => {
        expect(removeUnusedParams('Hi {user}, your score is {score}')).toBe('Hi , your score is')
    })

    it('returns the same string if there are no parameters', () => {
        expect(removeUnusedParams('No params here')).toBe('No params here')
    })

    it('removes parameters surrounded by other characters', () => {
        expect(removeUnusedParams('A{a}B{b}C')).toBe('ABC')
    })

    it('removes parameters with underscores and numbers', () => {
        expect(removeUnusedParams('Test {param_1} and {param2}')).toBe('Test and')
    })

    it('handles empty string', () => {
        expect(removeUnusedParams('')).toBe('')
    })

    it('removes adjacent parameters', () => {
        expect(removeUnusedParams('{a}{b}{c}')).toBe('')
    })

    it('removes double spaces', () => {
        expect(removeUnusedParams('{a} {b} {c}')).toBe('')
    })
})
