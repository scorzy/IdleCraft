import { beforeEach, describe, expect, it } from 'vitest'
import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { PLAYER_ID } from '../../characters/charactersConst'
import { createEnemies } from '../../characters/functions/createEnemies'
import { CharTemplateEnum } from '../../characters/templates/characterTemplateEnum'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Icons } from '../../icons/Icons'
import { CHARGED_ATTACK_DAMAGE_BONUS, CHARGED_ATTACK_STAMINA, CHARGED_ATTACK_TIME } from '../abilityConst'
import { ChargedAttack } from './ChargedAttack'

describe('ChargedAttack', () => {
    let state: GameState
    const ability = new ChargedAttack()

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('has no health or mana cost', () => {
        expect(ability.getHealthCost()).toBe(0)
        expect(ability.getManaCost()).toBe(0)
    })

    it('uses the saber slash icon', () => {
        expect(ability.getIconId()).toBe(Icons.SaberSlash)
    })

    it('scales charge time with attack speed', () => {
        const attackSpeed = getCharacterSelector(PLAYER_ID).AttackSpeed(state)
        expect(ability.getChargeTime({ state, characterId: PLAYER_ID })).toBe(attackSpeed * CHARGED_ATTACK_TIME)
    })

    it('derives stamina cost from the charge time', () => {
        const chargeTime = ability.getChargeTime({ state, characterId: PLAYER_ID })
        expect(ability.getStaminaCost({ state, characterId: PLAYER_ID })).toBeCloseTo(
            (chargeTime * CHARGED_ATTACK_STAMINA) / 1e3
        )
    })

    it('multiplies the caster all-attack damage by the charged attack bonus', () => {
        const base = getCharacterSelector(PLAYER_ID).AllAttackDamage(state)
        const expected = Object.fromEntries(Object.entries(base).map(([k, v]) => [k, v * CHARGED_ATTACK_DAMAGE_BONUS]))

        expect(ability.getDamage(PLAYER_ID, state)).toEqual(expected)
    })

    it('deals amplified damage to a random enemy', () => {
        createEnemies(state, [{ quantity: 1, template: CharTemplateEnum.Wolf }])
        const enemyId = state.characters.ids.find((id) => id !== PLAYER_ID)!
        state.characters.entries[enemyId]!.health = 1e9
        const before = state.characters.entries[enemyId]!.health

        ability.exec({ state, characterId: PLAYER_ID })

        expect(state.characters.entries[enemyId]!.health).toBeLessThan(before)
    })
})
