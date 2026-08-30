import { GameState } from '../../game/GameState'

const EMPTY_ARRAY = [] as const
export const selectAllCombatAbilities = (state: GameState) =>
    state.characters.entries[state.ui.selectedCharId]?.allCombatAbilities.ids ?? EMPTY_ARRAY
