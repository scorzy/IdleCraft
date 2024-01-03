import { GameState } from '../game/GameState'

export enum ActivityStartResult {
    Started,
    NotPossible,
    Ended,
}
export interface StartResult {
    gameState: GameState
    result: ActivityStartResult
}
