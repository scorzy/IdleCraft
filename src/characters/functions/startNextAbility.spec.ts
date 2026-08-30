import { beforeEach, describe, expect, it } from 'vitest'
import { AbilitiesEnum } from '../../activeAbilities/abilitiesEnum'
import { CastCharAbilityAdapter, CharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { CharacterAdapter } from '../characterAdapter'
import { PLAYER_ID } from '../charactersConst'
import { startNextAbility } from './startNextAbility'

describe('startNextAbility', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('starts with the first configured combat ability, then advances through the rotation', () => {
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        CharAbilityAdapter.create(char.allCombatAbilities, {
            id: AbilitiesEnum.ChargedAttack,
            abilityId: AbilitiesEnum.ChargedAttack,
        })
        char.combatAbilities = [AbilitiesEnum.ChargedAttack, AbilitiesEnum.NormalAttack]

        startNextAbility(state, PLAYER_ID)

        const firstCast = CastCharAbilityAdapter.selectEx(state.castCharAbility, state.castCharAbility.ids[0]!)
        expect(firstCast.abilityId).toBe(AbilitiesEnum.ChargedAttack)
        expect(char.lastCombatAbilityNum).toBe(0)

        state.castCharAbility = CastCharAbilityAdapter.getInitialState()
        startNextAbility(state, PLAYER_ID)

        const secondCast = CastCharAbilityAdapter.selectEx(state.castCharAbility, state.castCharAbility.ids[0]!)
        expect(secondCast.abilityId).toBe(AbilitiesEnum.NormalAttack)
        expect(char.lastCombatAbilityNum).toBe(1)
    })
})
