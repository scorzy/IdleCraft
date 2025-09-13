import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'

export function resetMana(state: GameState, charId: string): void {
    const mana = getCharacterSelector(charId).MaxMana(state)
    CharacterAdapter.selectEx(state.characters, charId).mana = mana
}
