import { GameState } from '../../game/GameState'

export const selectAllCombatAbilities = (state: GameState) =>
    state.characters.entries[state.ui.selectedCharId]?.allCombatAbilities.ids ?? []
