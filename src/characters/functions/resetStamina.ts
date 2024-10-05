import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../characterSelectorsNew'

export function resetStamina(state: GameState, charId: string): GameState {
    const stamina = getCharacterSelector(charId).MaxStamina(state)
    return { ...state, characters: CharacterAdapter.update(state.characters, charId, { stamina }) }
}
