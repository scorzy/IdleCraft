import { GameState } from '../../game/GameState'
import { addLoot } from './addLoot'
import { removeCharacter } from './removeCharacter'

export function kill(state: GameState, targetId: string): GameState {
    state = addLoot(state, targetId)
    state = removeCharacter(state, targetId)
    return state
}
