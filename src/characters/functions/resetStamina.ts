import { GameState } from '../../game/GameState'
import { CharacterStateAdapter } from '../characterAdapter'
import { selectCharacterMaxStamina } from '../selectors/staminaSelectors'

export function resetStamina(state: GameState, charId: string): GameState {
    const stamina = selectCharacterMaxStamina(charId)(state)
    return { ...state, characters: CharacterStateAdapter.update(state.characters, charId, { stamina }) }
}
