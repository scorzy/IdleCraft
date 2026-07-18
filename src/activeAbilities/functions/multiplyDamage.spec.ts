import { describe, expect, it } from 'vitest'
import { DamageTypes } from '../../items/Item'
import { multiplyDamage } from './multiplyDamage'

describe('multiplyDamage', () => {
    it('multiplies every damage type by the multiplier', () => {
        const result = multiplyDamage({ [DamageTypes.Slashing]: 10, [DamageTypes.Piercing]: 4 }, 2)
        expect(result).toEqual({ [DamageTypes.Slashing]: 20, [DamageTypes.Piercing]: 8 })
    })

    it('returns an empty object when given no damage', () => {
        expect(multiplyDamage({}, 3)).toEqual({})
    })

    it('zeroes out damage when multiplier is 0', () => {
        expect(multiplyDamage({ [DamageTypes.Bludgeoning]: 15 }, 0)).toEqual({ [DamageTypes.Bludgeoning]: 0 })
    })

    it('does not mutate the input damage object', () => {
        const damage = { [DamageTypes.Slashing]: 10 }
        multiplyDamage(damage, 5)
        expect(damage).toEqual({ [DamageTypes.Slashing]: 10 })
    })
})
