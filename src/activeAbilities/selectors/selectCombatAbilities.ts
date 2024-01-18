import { GameState } from '../../game/GameState'

export const selectCombatAbilities = (state: GameState) =>
    state.characters.entries[state.ui.selectedCharId]?.combatAbilities ?? []

export const selectCombatAbilitiesChar = (charId: string) => (state: GameState) =>
    state.characters.entries[charId]?.combatAbilities ?? []
