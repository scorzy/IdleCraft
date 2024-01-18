import { CharacterAdapter } from '../../characters/characterAdapter'
import { useGameStore } from '../../game/state'
import { AbilitiesEnum } from '../abilitiesEnum'

export const addRotation = () =>
    useGameStore.setState((state) => {
        const charId = state.ui.selectedCharId
        const char = CharacterAdapter.selectEx(state.characters, charId)

        const combatAbilities = [...char.combatAbilities, AbilitiesEnum.NormalAttack]

        state = { ...state, characters: CharacterAdapter.update(state.characters, charId, { combatAbilities }) }
        return state
    })
