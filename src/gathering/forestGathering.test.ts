import { describe, expect, it } from 'vitest'
import { gatherForest } from './data/forestGathering'
import { Rarity } from './gatheringTypes'

describe('gatherForest', () => {
    it('always returns one guaranteed common resource', () => {
        const result = gatherForest(() => 0.99)

        expect(result).toHaveLength(2)
        expect(result[0]?.rarity).toBe(Rarity.Common)
    })

    it('rolls common on bonus roll when random value is in common range', () => {
        const result = gatherForest(() => 0.2)

        expect(result[1]?.rarity).toBe(Rarity.Common)
    })

    it('rolls uncommon on bonus roll when random value is in uncommon range', () => {
        const result = gatherForest(() => 0.8)

        expect(result[1]?.rarity).toBe(Rarity.Uncommon)
    })

    it('rolls rare on bonus roll when random value is in rare range', () => {
        const result = gatherForest(() => 0.99)

        expect(result[1]?.rarity).toBe(Rarity.Rare)
    })
})
