import { GameState } from '../../game/GameState'
import { removeCharacter } from './removeCharacter'

export function kill(state: GameState, targetId: string) {
    return removeCharacter(state, targetId)
}
