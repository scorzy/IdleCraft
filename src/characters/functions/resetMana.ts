import { GameState } from '../../game/GameState'
import { selectCharacter } from '../characterSelectors'
import { selectCharacterMaxMana } from '../selectors/manaSelectors'

export function resetMana(state: GameState, charId: string): GameState {
    const mana = selectCharacterMaxMana(charId)(state)
    const char = selectCharacter(state, charId)
    return { ...state, characters: { ...state.characters, [charId]: { ...char, mana } } }
}
