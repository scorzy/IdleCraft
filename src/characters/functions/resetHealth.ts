import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { selectCharacterMaxHealth } from '../selectors/healthSelectors'

export function resetHealth(state: GameState, charId: string): GameState {
    const health = selectCharacterMaxHealth(charId)(state)
    return { ...state, characters: CharacterAdapter.update(state.characters, charId, { health }) }
}
