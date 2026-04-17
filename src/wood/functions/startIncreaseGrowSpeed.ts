import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { INCREASE_GROW_SPEED_TIME } from '../GrowSpeedConst'
import { isIncreaseGrowSpeed } from '../IncreaseGrowSpeed'

export const startIncreaseGrowSpeed = makeStartActivity((state: GameState, id: string) => {
    const act = ActivityAdapter.select(state.activities, id)
    if (!act || !isIncreaseGrowSpeed(act)) return ActivityStartResult.NotPossible

    startTimer(state, INCREASE_GROW_SPEED_TIME, ActivityTypes.IncreaseGrowSpeed, id)
    return ActivityStartResult.Started
})
