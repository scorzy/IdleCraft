import { GameState } from '../../game/GameState'
import { CharacterStateAdapter } from '../characterAdapter'
import { selectCharacterMaxHealth } from '../selectors/healthSelectors'

export function resetHealth(state: GameState, charId: string): GameState {
    const health = selectCharacterMaxHealth(charId)(state)
    return { ...state, characters: CharacterStateAdapter.update(state.characters, charId, { health }) }
}
