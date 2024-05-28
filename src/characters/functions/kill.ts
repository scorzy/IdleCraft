import { GameState } from '../../game/GameState'
import { addLoot } from '../../storage/function/addLoot'
import { CharacterAdapter } from '../characterAdapter'
import { removeCharacter } from './removeCharacter'

export function kill(state: GameState, targetId: string): GameState {
    const loot = CharacterAdapter.selectEx(state.characters, targetId).loot
    if (loot) state = addLoot(state, loot)
    state = removeCharacter(state, targetId)
    return state
}
