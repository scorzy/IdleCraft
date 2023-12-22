import { GameState } from '../../game/GameState'
import { CharacterStateAdapter } from '../characterAdapter'
import { selectCharacterMaxMana } from '../selectors/manaSelectors'

export function resetMana(state: GameState, charId: string): GameState {
    const mana = selectCharacterMaxMana(charId)(state)
    return { ...state, characters: CharacterStateAdapter.update(state.characters, charId, { mana }) }
}
