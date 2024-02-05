import { describe, expect, it } from 'vitest'
import { getDamageMulti } from './getDamageMulti'

describe('getDamageMulti', () => {
    it('zero damage', () => expect(getDamageMulti(0, 10)).toBe(0))
    it('zero damage negative armour', () => expect(getDamageMulti(0, -10)).toBe(0))
    it('zero damage zero armour', () => expect(getDamageMulti(0, 0)).toBe(0))
    it('negative armour', () => expect(getDamageMulti(20, -10)).toBe(2))
    it('zero armour', () => expect(getDamageMulti(10, 0)).toBe(1))
    it('equal', () => expect(getDamageMulti(15, 15)).toBe(0.5))
    it('double damage', () => expect(getDamageMulti(30, 15)).toBe(2 / 3))
})
