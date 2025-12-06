import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'
import { addHealth, addMana, addStamina } from './charFunctions'

export function regenerateChars(state: GameState, seconds: number): void {
    const charIds = CharacterAdapter.getIds(state.characters)
    for (const charId of charIds) regenerateChar(state, charId, seconds)
}
function regenerateChar(state: GameState, charId: string, seconds: number): void {
    const char = CharacterAdapter.selectEx(state.characters, charId)
    const charSel = getCharacterSelector(charId)

    addHealth(state, char, charSel.HealthRegen(state) * seconds)
    addStamina(state, char, charSel.StaminaRegen(state) * seconds)
    addMana(state, char, charSel.ManaRegen(state) * seconds)
}
