import { GameState } from '../../game/GameState'
import { CharacterAdapter } from '../characterAdapter'
import { selectCharacterMaxHealth } from '../selectors/healthSelectors'
import { selectCharacterMaxMana } from '../selectors/manaSelectors'
import { selectCharacterMaxStamina } from '../selectors/staminaSelectors'

export function regenerateChars(state: GameState, seconds: number) {
    const charIds = CharacterAdapter.getIds(state.characters)
    for (const charId of charIds) state = regenerateChar(state, charId, seconds)

    return state
}
function regenerateChar(state: GameState, charId: string, seconds: number): GameState {
    const char = CharacterAdapter.selectEx(state.characters, charId)

    const maxHealth = selectCharacterMaxHealth(charId)(state)
    const maxStamina = selectCharacterMaxStamina(charId)(state)
    const maxMana = selectCharacterMaxMana(charId)(state)

    const health = Math.min(char.health + seconds, maxHealth)
    const stamina = Math.min(char.stamina + seconds, maxStamina)
    const mana = Math.min(char.mana + seconds, maxMana)

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
