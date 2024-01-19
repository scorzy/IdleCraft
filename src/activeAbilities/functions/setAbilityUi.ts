import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'

export const setAbilityUi = (selectedAbilityId: string) =>
    useGameStore.setState((state: GameState) => {
        state = {
            ...state,
            characters: CharacterAdapter.update(state.characters, state.ui.selectedCharId, { selectedAbilityId }),
        }
        return state
    })
