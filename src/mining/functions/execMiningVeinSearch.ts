import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { searchOreVein } from '../miningFunctions'

export const execMiningVeinSearch = makeExecActivity((state: GameState, _timer: Timer) => {
    const vein = searchOreVein(state, state.location)
    return vein ? ActivityStartResult.Ended : ActivityStartResult.NotPossible
})
