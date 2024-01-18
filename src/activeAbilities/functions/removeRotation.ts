import { CharacterAdapter } from '../../characters/characterAdapter'
import { useGameStore } from '../../game/state'

export const removeRotation = (index: number) =>
    useGameStore.setState((state) => {
        const charId = state.ui.selectedCharId
        const char = CharacterAdapter.selectEx(state.characters, charId)

        const combatAbilities = char.combatAbilities.filter((_v, i) => i !== index)

        state = { ...state, characters: CharacterAdapter.update(state.characters, charId, { combatAbilities }) }
        return state
    })
