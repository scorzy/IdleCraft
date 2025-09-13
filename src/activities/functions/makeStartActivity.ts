import { GameState } from '../../game/GameState'
import { ActivityStartResult } from '../activityInterfaces'

export const makeStartActivity =
    (fun: (state: GameState, activityId: string) => ActivityStartResult) => (state: GameState, activityId: string) => {
        const result = fun(state, activityId)
        state.activityId = activityId
        return result
    }
