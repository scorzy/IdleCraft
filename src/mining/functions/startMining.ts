import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { Mining } from '../Mining'
import { hasOre } from '../miningFunctions'
import { getMiningActivity } from '../selectors/getMiningActivity'
import { selectMiningTime } from '../selectors/miningTime'
import { startMiningOre } from './startMiningOre'

export const startMining = makeStartActivity((state: GameState, id: string) => {
    const data = getMiningActivity(state.activities, id)
    if (hasOre(state, data.oreType)) state = startMiningOre(state, id)
    else {
        const time = selectMiningTime(state)
        state = startTimer(state, time, ActivityTypes.Mining, id)
        const mining: Partial<Mining> = { isMining: false }
        if (data.isMining)
            state = {
                ...state,
                activities: ActivityAdapter.update(state.activities, id, mining),
            }
    }
    return { state, result: ActivityStartResult.Started }
})
