import { GameState } from '../../game/GameState'
import { selectCharacter } from '../characterSelectors'
import { selectCharacterMaxHealth } from '../selectors/healthSelectors'

export function resetHealth(state: GameState, charId: string): GameState {
    const health = selectCharacterMaxHealth(charId)(state)
    const char = selectCharacter(state, charId)
    return { ...state, characters: { ...state.characters, [charId]: { ...char, health } } }
}
