import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { Woodcutting } from '../Woodcutting'
import { hasTrees } from '../forest/forestFunctions'
import { selectWoodcuttingTime } from '../selectors/woodcuttingTime'

export const startWoodcutting = makeStartActivity((state: GameState, id: string) => {
    const data = ActivityAdapter.selectEx(state.activities, id) as Woodcutting

    if (!hasTrees(state, data.woodType)) {
        state.waitingTrees = id
        return ActivityStartResult.Started
    }

    state.waitingTrees = null
    const time = selectWoodcuttingTime(state)
    startTimer(state, time, ActivityTypes.Woodcutting, id)

    return ActivityStartResult.Started
})
