import { describe, expect, it } from 'vitest'
import { arraySample } from './arraySample'

describe('arraySample', () => {
    it('returns undefined for an empty array', () => {
        expect(arraySample([])).toBeUndefined()
    })

    it('returns the only element for a single-item array', () => {
        expect(arraySample([42])).toBe(42)
    })

    it('always returns an element that belongs to the array', () => {
        const array = ['a', 'b', 'c', 'd', 'e']
        for (let i = 0; i < 50; i++) {
            expect(array).toContain(arraySample(array))
        }
    })
})
