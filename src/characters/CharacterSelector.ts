import { GameState } from '../game/GameState'

export type CharacterSelector = {
    selectCharLevel(state: GameState): number
}
