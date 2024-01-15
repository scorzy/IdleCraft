import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { MiningAdapter } from '../MiningAdapter'
import { selectMiningTime } from '../selectors/miningTime'

export function startMiningOre(state: GameState, id: string): GameState {
    const data = MiningAdapter.selectEx(state.mining, id)
    const time = selectMiningTime(state)
    state = startTimer(state, time, ActivityTypes.Mining, id)
    if (!data.isMining)
        state = {
            ...state,
            mining: MiningAdapter.update(state.mining, id, { isMining: true }),
        }

    return state
}
