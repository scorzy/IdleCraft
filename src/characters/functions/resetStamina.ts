import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'

export function resetStamina(state: GameState, charId: string): void {
    const stamina = getCharacterSelector(charId).MaxStamina(state)
    CharacterAdapter.selectEx(state.characters, charId).stamina = stamina
}
