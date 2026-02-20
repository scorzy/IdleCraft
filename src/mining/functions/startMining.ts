import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { hasOre, getCurrentOreVeinByType } from '../miningFunctions'
import { getMiningActivity } from '../selectors/getMiningActivity'
import { selectMiningTime } from '../selectors/miningTime'
import { startMiningOre } from './startMiningOre'

export const startMining = makeStartActivity((state: GameState, id: string) => {
    const data = getMiningActivity(state.activities, id)
    const vein = getCurrentOreVeinByType(state, state.location, data.oreType)

    if (vein) {
        data.activeVeinId = vein.id
        data.activeOreType = vein.oreType
        startMiningOre(state, id)
        return ActivityStartResult.Started
    }

    data.activeVeinId = undefined
    data.activeOreType = data.oreType

    if (hasOre(state, data.oreType)) {
        startMiningOre(state, id)
    } else {
        const time = selectMiningTime(state)
        startTimer(state, time, ActivityTypes.Mining, id)
        data.isMining = false
    }

    return ActivityStartResult.Started
})
