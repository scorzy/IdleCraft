import { describe, expect, it } from 'vitest'
import { getDamageMulti } from './getDamageMulti'

describe('getDamageMulti', () => {
    it('zero damage', () => expect(getDamageMulti(0, 10)).toBe(0))
    it('zero damage negative armour', () => expect(getDamageMulti(0, -10)).toBe(0))
    it('zero damage zero armour', () => expect(getDamageMulti(0, 0)).toBe(0))
    it('negative armour', () => expect(getDamageMulti(20, -10)).toBeCloseTo(Math.SQRT2))
    it('zero armour', () => expect(getDamageMulti(10, 0)).toBe(1))
    it('equal', () => expect(getDamageMulti(15, 15)).toBe(0.5))
    it('double damage', () => expect(getDamageMulti(30, 15)).toBeCloseTo(0.5857))

    it('damage 12, armour 168', () => expect(getDamageMulti(12, 168)).toBeCloseTo(0.2108))
    it('damage 24 (12 * 2), armour 168', () => expect(getDamageMulti(24, 168)).toBeCloseTo(0.2742))
})
