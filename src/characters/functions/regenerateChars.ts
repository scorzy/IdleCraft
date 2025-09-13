import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'

export function regenerateChars(state: GameState, seconds: number): void {
    const charIds = CharacterAdapter.getIds(state.characters)
    for (const charId of charIds) regenerateChar(state, charId, seconds)
}
function regenerateChar(state: GameState, charId: string, seconds: number): void {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    const charSel = getCharacterSelector(charId)

    const maxHealth = charSel.MaxHealth(state)
    const maxStamina = charSel.MaxStamina(state)
    const maxMana = charSel.MaxMana(state)

    char.health = Math.min(char.health + seconds / 2, maxHealth)
    char.stamina = Math.min(char.stamina + seconds / 2, maxStamina)
    char.mana = Math.min(char.mana + seconds / 2, maxMana)
}
