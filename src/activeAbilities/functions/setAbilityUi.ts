import { CharacterAdapter } from '../../characters/characterAdapter'
import { GameState } from '../../game/GameState'
import { setState } from '../../game/setState'

export const setAbilityUi = (selectedAbilityId: string) =>
    setState((state: GameState) => {
        CharacterAdapter.update(state.characters, state.ui.selectedCharId, { selectedAbilityId })
    })
