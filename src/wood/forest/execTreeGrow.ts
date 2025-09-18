import { startNextActivity } from '../../activities/activityFunctions'
import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { growTree } from './growTree'

export function execTreeGrow(state: GameState, timer: Timer) {
    growTree(state, timer.actId)
    if (state.waitingTrees === state.activityId) startNextActivity(state)
}
