import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { canSearchOreVein } from '../miningFunctions'

const SEARCH_ORE_VEIN_TIME = 8000

export const startMiningVeinSearch = makeStartActivity((state: GameState, id: string) => {
    if (!canSearchOreVein(state, state.location)) return ActivityStartResult.NotPossible

    startTimer(state, SEARCH_ORE_VEIN_TIME, ActivityTypes.MiningVeinSearch, id)
    return ActivityStartResult.Started
})
