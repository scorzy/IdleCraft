import { CharacterAdapter } from '../../characters/characterAdapter'
import { removeCharacter } from '../../characters/functions/removeCharacter'
import { GameState } from '../../game/GameState'

export function endBattle(state: GameState): GameState {
    const charIds = CharacterAdapter.getIds(state.characters)
    charIds.forEach((charId) => {
        const char = CharacterAdapter.selectEx(state.characters, charId)
        if (!char) return
        if (char.isEnemy) state = removeCharacter(state, charId)
    })
    return state
}
