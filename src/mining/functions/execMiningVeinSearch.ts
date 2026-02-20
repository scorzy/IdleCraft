import { ActivityStartResult } from '../../activities/activityInterfaces'
import { ActivityAdapter } from '../../activities/ActivityState'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { OreTypes } from '../OreTypes'
import { searchOreVein } from '../miningFunctions'

export const execMiningVeinSearch = makeExecActivity((state: GameState, timer: Timer) => {
    const act = ActivityAdapter.select(state.activities, timer.actId)
    if (!act || !('oreType' in act) || (act.oreType !== OreTypes.Copper && act.oreType !== OreTypes.Tin))
        return ActivityStartResult.NotPossible

    const vein = searchOreVein(state, state.location, act.oreType)
    return vein ? ActivityStartResult.Ended : ActivityStartResult.NotPossible
})
