import { describe, expect, it } from 'vitest'
import { sameNumber } from './sameNumber'

describe('sameNumber', () => {
    it('returns true for identical numbers', () => expect(sameNumber(5, 5)).toBe(true))
    it('returns true for numbers within the epsilon tolerance', () => expect(sameNumber(1, 1.0000001)).toBe(true))
    it('returns false for numbers outside the epsilon tolerance', () => expect(sameNumber(1, 1.01)).toBe(false))
    it('returns true for negative numbers that are equal', () => expect(sameNumber(-3, -3)).toBe(true))
    it('is symmetric', () => expect(sameNumber(2, 1.9999999)).toBe(sameNumber(1.9999999, 2)))
    it('returns false for clearly different numbers', () => expect(sameNumber(0, 100)).toBe(false))
})
