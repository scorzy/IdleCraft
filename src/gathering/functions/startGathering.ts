import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { isGathering } from '../Gathering'
import { selectGatheringTime } from '../selectors/gatheringTime'

export const startGathering = makeStartActivity((state: GameState, id: string) => {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isGathering(data)) throw new Error('[startGathering] Activity is not gathering')

    startTimer(state, selectGatheringTime(data.zone).gatheringTime(state), ActivityTypes.Gathering, id)

    return ActivityStartResult.Started
})
