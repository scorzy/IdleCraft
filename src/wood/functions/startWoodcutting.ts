import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'
import { hasTrees } from '../forest/forestFunctions'
import { selectWoodcuttingTime } from '../selectors/WoodcuttingSelectors'

export const startWoodcutting = makeStartActivity((state: GameState, id: string) => {
    const data = WoodcuttingAdapter.selectEx(state.woodcutting, id)

    if (!hasTrees(state, data.woodType)) {
        state = { ...state, waitingTrees: id }
        return { state, result: ActivityStartResult.Started }
    }

    state = { ...state, waitingTrees: null }
    const time = selectWoodcuttingTime(state)
    state = startTimer(state, time, ActivityTypes.Woodcutting, id)

    return { state, result: ActivityStartResult.Started }
})
