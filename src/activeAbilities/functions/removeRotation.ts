import { CharacterAdapter } from '../../characters/characterAdapter'
import { setState } from '../../game/setState'

export const removeRotation = (index: number) =>
    setState((state) => {
        const charId = state.ui.selectedCharId
        const char = CharacterAdapter.selectEx(state.characters, charId)

        char.combatAbilities.splice(index, 1)
    })
