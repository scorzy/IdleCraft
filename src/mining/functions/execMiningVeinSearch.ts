import { ActivityAdapter } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { searchOreVein } from '../miningFunctions'
import { OreTypes } from '../OreTypes'

export const execMiningVeinSearch = makeExecActivity((state: GameState, timer: Timer) => {
    const act = ActivityAdapter.select(state.activities, timer.actId)
    if (!act || !('oreType' in act) || (act.oreType !== OreTypes.Copper && act.oreType !== OreTypes.Tin))
        return ActivityStartResult.NotPossible

    const vein = searchOreVein(state, state.location, act.oreType)
    return vein ? ActivityStartResult.Ended : ActivityStartResult.NotPossible
})
