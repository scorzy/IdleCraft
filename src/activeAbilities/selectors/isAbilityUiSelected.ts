import { GameState } from '../../game/GameState'

export const isAbilityUiSelected = (id: string) => (state: GameState) =>
    state.characters.entries[state.ui.selectedCharId]?.selectedAbilityId === id
