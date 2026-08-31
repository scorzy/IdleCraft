import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../game/functions/initialize'
import { GetInitialGameState } from '../game/InitialGameState'
import { DamageTypes } from '../items/Item'
import { getCharacterSelector } from './getCharacterSelector'
import { getCharacterDefinition } from './templates/characterRegistry'
import { generateCharacter } from './templates/generateCharacter'

describe('getCharacterSelector', () => {
    beforeEach(() => initialize())

    it('calculates combat values for a generated character outside game state', () => {
        const state = GetInitialGameState()
        const preview = generateCharacter('Chicken', getCharacterDefinition('Chicken'))
        const selector = getCharacterSelector(preview.id, preview)

        expect(selector.Name(state)).toBe('Chicken')
        expect(selector.AllAttackDamage(state)).toEqual({ [DamageTypes.Piercing]: 2 })
        expect(selector.armour[DamageTypes.Slashing].Armour(state)).toBe(0)
    })
})
