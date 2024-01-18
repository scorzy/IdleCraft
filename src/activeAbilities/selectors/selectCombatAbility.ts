import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'

export const selectCombatAbility = (index: number) => (state: GameState) => {
    const combatAbilities = CharacterAdapter.selectEx(state.characters, state.ui.selectedCharId).combatAbilities
    if (!combatAbilities.length) return
    return combatAbilities[index]
}
export const selectCombatAbilityId = (index: number) => (state: GameState) => {
    const char = CharacterAdapter.selectEx(state.characters, state.ui.selectedCharId)
    const combatAbilities = char.combatAbilities
    if (!combatAbilities.length) return
    const charAbility = combatAbilities[index]
    return charAbility
}
