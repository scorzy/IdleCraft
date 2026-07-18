import { beforeEach, describe, expect, it } from 'vitest'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { PLAYER_ID } from '../../characters/charactersConst'
import { createEnemies } from '../../characters/functions/createEnemies'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Icons } from '../../icons/Icons'
import { NormalAttack } from './NormalAttack'

describe('NormalAttack', () => {
    let state: GameState
    const ability = new NormalAttack()

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('has no resource costs', () => {
        expect(ability.getHealthCost()).toBe(0)
        expect(ability.getStaminaCost({ state, characterId: PLAYER_ID })).toBe(0)
        expect(ability.getManaCost()).toBe(0)
    })

    it('uses an unarmed punch icon when no weapon is equipped', () => {
        expect(ability.getIconId({ state, characterId: PLAYER_ID })).toBe(Icons.Punch)
    })

    it('uses the attack speed of the caster as the charge time', () => {
        expect(ability.getChargeTime({ state, characterId: PLAYER_ID })).toBe(
            getCharacterSelector(PLAYER_ID).AttackSpeed(state)
        )
    })

    it('returns the caster all-attack damage', () => {
        expect(ability.getDamage(PLAYER_ID, state)).toEqual(getCharacterSelector(PLAYER_ID).AllAttackDamage(state))
    })

    it('does nothing when there is no opposing character', () => {
        expect(() => ability.exec({ state, characterId: PLAYER_ID })).not.toThrow()
        expect(state.battleLogs.ids).toHaveLength(0)
    })

    it('deals damage to a random enemy and logs it', () => {
        createEnemies(state, [{ quantity: 1, template: CharTemplateEnum.Wolf }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!
        const before = state.characters.entries[enemyId]!.health

        ability.exec({ state, characterId: PLAYER_ID })

        expect(state.characters.entries[enemyId]!.health).toBeLessThan(before)
        expect(state.battleLogs.ids.length).toBeGreaterThan(0)
    })
})
