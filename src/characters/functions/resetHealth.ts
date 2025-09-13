import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'

export function resetHealth(state: GameState, charId: string): void {
    const health = getCharacterSelector(charId).MaxHealth(state)
    CharacterAdapter.selectEx(state.characters, charId).health = health
}
