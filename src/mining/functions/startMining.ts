import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { hasOre } from '../miningFunctions'
import { getMiningActivity } from '../selectors/getMiningActivity'
import { selectMiningTime } from '../selectors/miningTime'
import { startMiningOre } from './startMiningOre'

export const startMining = makeStartActivity((state: GameState, id: string) => {
    const data = getMiningActivity(state.activities, id)
    if (hasOre(state, data.oreType)) startMiningOre(state, id)
    else {
        const time = selectMiningTime(state)
        startTimer(state, time, ActivityTypes.Mining, id)
        if (data.isMining) data.isMining = false
    }
    return ActivityStartResult.Started
})
