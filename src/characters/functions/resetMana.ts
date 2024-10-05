import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../characterSelectorsNew'

export function resetMana(state: GameState, charId: string): GameState {
    const mana = getCharacterSelector(charId).MaxMana(state)
    return { ...state, characters: CharacterAdapter.update(state.characters, charId, { mana }) }
}
