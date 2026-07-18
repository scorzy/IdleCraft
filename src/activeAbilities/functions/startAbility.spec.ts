import { beforeEach, describe, expect, it } from 'vitest'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { PLAYER_ID } from '../../characters/charactersConst'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { AbilitiesEnum } from '../abilitiesEnum'
import { CastCharAbilityAdapter } from '../abilityAdapters'
import { startAbility } from './startAbility'

describe('startAbility', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('creates a cast entry and a timer when resources are sufficient', () => {
        const result = startAbility(state, PLAYER_ID, AbilitiesEnum.NormalAttack)

        expect(result).toBe(true)
        expect(state.castCharAbility.ids).toHaveLength(1)
        const cast = CastCharAbilityAdapter.selectEx(state.castCharAbility, state.castCharAbility.ids[0]!)
        expect(cast.abilityId).toBe(AbilitiesEnum.NormalAttack)
        expect(cast.characterId).toBe(PLAYER_ID)
        expect(state.timers.ids).toHaveLength(1)
    })

    it('does not create a cast entry or timer when resources are insufficient', () => {
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        char.stamina = 0

        const result = startAbility(state, PLAYER_ID, AbilitiesEnum.ChargedAttack)

        expect(result).toBe(false)
        expect(state.castCharAbility.ids).toHaveLength(0)
        expect(state.timers.ids).toHaveLength(0)
    })
})
