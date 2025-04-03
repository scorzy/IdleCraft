import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { Mining } from '../Mining'
import { getMiningActivity } from '../selectors/getMiningActivity'
import { selectMiningTime } from '../selectors/miningTime'

export function startMiningOre(state: GameState, id: string): GameState {
    const data = getMiningActivity(state.activities, id)
    const time = selectMiningTime(state)
    state = startTimer(state, time, ActivityTypes.Mining, id)
    if (!data.isMining)
        state = {
            ...state,
            activities: ActivityAdapter.update(state.activities, id, { isMining: true } as Partial<Mining>),
        }

    return state
}
