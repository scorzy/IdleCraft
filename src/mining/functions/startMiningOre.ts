import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { getMiningActivity } from '../selectors/getMiningActivity'
import { selectMiningTime } from '../selectors/miningTime'

export function startMiningOre(state: GameState, id: string): void {
    const data = getMiningActivity(state.activities, id)
    const time = selectMiningTime(state)
    startTimer(state, time, ActivityTypes.Mining, id)
    data.isMining = true
}
