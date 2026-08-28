import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'
import { addHealth, addMana, addStamina } from './charFunctions'
import { removeCharacter } from './removeCharacter'

export function regenerateChars(state: GameState, seconds: number): void {
    const charIds = CharacterAdapter.getIds(state.characters).slice()
    for (const charId of charIds) {
        if (CharacterAdapter.select(state.characters, charId)) regenerateChar(state, charId, seconds)
    }
}
function regenerateChar(state: GameState, charId: string, seconds: number): void {
    const char = CharacterAdapter.selectEx(state.characters, charId)
    const charSel = getCharacterSelector(charId)

    addHealth(state, char, charSel.HealthRegen(state) * seconds)
    if (char.health <= 0) {
        removeCharacter(state, charId)
        return
    }
    addStamina(state, char, charSel.StaminaRegen(state) * seconds)
    addMana(state, char, charSel.ManaRegen(state) * seconds)
}
