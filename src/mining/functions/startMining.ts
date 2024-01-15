import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { MiningAdapter } from '../MiningAdapter'
import { hasOre } from '../miningFunctions'
import { selectMiningTime } from '../selectors/miningTime'
import { startMiningOre } from './startMiningOre'

export const startMining = makeStartActivity((state: GameState, id: string) => {
    const data = MiningAdapter.selectEx(state.mining, id)
    if (hasOre(state, data.oreType)) state = startMiningOre(state, id)
    else {
        const time = selectMiningTime(state)
        state = startTimer(state, time, ActivityTypes.Mining, id)
        if (data.isMining)
            state = {
                ...state,
                mining: MiningAdapter.update(state.mining, id, { isMining: false }),
            }
    }
    return { state, result: ActivityStartResult.Started }
})
