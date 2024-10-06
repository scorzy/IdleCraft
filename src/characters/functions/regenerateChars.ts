import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { getCharacterSelector } from '../getCharacterSelector'

export function regenerateChars(state: GameState, seconds: number) {
    const charIds = CharacterAdapter.getIds(state.characters)
    for (const charId of charIds) state = regenerateChar(state, charId, seconds)

    return state
}
function regenerateChar(state: GameState, charId: string, seconds: number): GameState {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    const charSel = getCharacterSelector(charId)

    const maxHealth = charSel.MaxHealth(state)
    const maxStamina = charSel.MaxStamina(state)
    const maxMana = charSel.MaxMana(state)

    const health = Math.min(char.health + seconds / 2, maxHealth)
    const stamina = Math.min(char.stamina + seconds / 2, maxStamina)
    const mana = Math.min(char.mana + seconds / 2, maxMana)

    state = {
        ...state,
        characters: CharacterAdapter.update(state.characters, charId, {
            health,
            stamina,
            mana,
        }),
    }

    return state
}
