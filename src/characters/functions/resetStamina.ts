import { GameState } from '../../game/GameState'
import { selectCharacter } from '../characterSelectors'
import { selectCharacterMaxStamina } from '../selectors/staminaSelectors'

export function resetStamina(state: GameState, charId: string): GameState {
    const stamina = selectCharacterMaxStamina(charId)(state)
    const char = selectCharacter(state, charId)
    return { ...state, characters: { ...state.characters, [charId]: { ...char, stamina } } }
}
