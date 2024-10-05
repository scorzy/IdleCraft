import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../characterSelectorsNew'

export function resetHealth(state: GameState, charId: string): GameState {
    const health = getCharacterSelector(charId).MaxHealth(state)

    return { ...state, characters: CharacterAdapter.update(state.characters, charId, { health }) }
}
