import { describe, expect, it } from 'vitest'
import { DamageTypes } from '../../items/Item'
import { sumDamage } from './sumDamage'

describe('sumDamage', () => {
    it('sums a single damage type', () => {
        expect(sumDamage({ [DamageTypes.Slashing]: 12 })).toBe(12)
    })

    it('sums multiple damage types', () => {
        expect(sumDamage({ [DamageTypes.Slashing]: 10, [DamageTypes.Piercing]: 5, [DamageTypes.Bludgeoning]: 3 })).toBe(
            18
        )
    })
})
