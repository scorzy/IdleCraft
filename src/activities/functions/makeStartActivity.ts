import { GameState } from '../../game/GameState'
import { ActivityStartResult } from '../activityInterfaces'

export const makeStartActivity =
    (fun: (state: GameState, activityId: string) => { state: GameState; result: ActivityStartResult }) =>
    (state: GameState, activityId: string) => {
        const { result, state: gameState } = fun(state, activityId)
        state = gameState
        state = { ...state, activityId }
        return { state, result }
    }
