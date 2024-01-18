import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'

export const changeCombatAbility = (index: number, abilityId: string) =>
    useGameStore.setState((state: GameState) => {
        const charId = state.ui.selectedCharId
        const char = CharacterAdapter.selectEx(state.characters, charId)

        const combatAbilities = [...char.combatAbilities]
        combatAbilities[index] = abilityId

        state = { ...state, characters: CharacterAdapter.update(state.characters, charId, { combatAbilities }) }

        return state
    })
