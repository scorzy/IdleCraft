import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { selectCharacterMaxMana } from '../selectors/manaSelectors'

export function resetMana(state: GameState, charId: string): GameState {
    const mana = selectCharacterMaxMana(charId)(state)
    return { ...state, characters: CharacterAdapter.update(state.characters, charId, { mana }) }
}
