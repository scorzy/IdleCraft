import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { OreTypes } from '../OreTypes'
import { canSearchOreVein } from '../miningFunctions'

export const SEARCH_ORE_VEIN_TIME = 8000

export const startMiningVeinSearch = makeStartActivity((state: GameState, id: string) => {
    const act = ActivityAdapter.select(state.activities, id)
    if (!act || !('oreType' in act) || (act.oreType !== OreTypes.Copper && act.oreType !== OreTypes.Tin))
        return ActivityStartResult.NotPossible

    if (!canSearchOreVein(state, state.location, act.oreType)) return ActivityStartResult.NotPossible

    startTimer(state, SEARCH_ORE_VEIN_TIME, ActivityTypes.MiningVeinSearch, id)
    return ActivityStartResult.Started
})
