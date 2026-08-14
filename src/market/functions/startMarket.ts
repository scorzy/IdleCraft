import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeStartActivity } from '../../activities/functions/makeStartActivity'
import { GameState } from '../../game/GameState'
import { hasItem } from '../../storage/storageFunctions'
import { startTimer } from '../../timers/startTimer'
import { isMarket } from '../Market'
import { selectMarketTime } from '../selectors/marketTime'

export const startMarket = makeStartActivity((state: GameState, id: string) => {
    const data = ActivityAdapter.selectEx(state.activities, id)
    if (!isMarket(data)) throw new Error('Activity data is not for market')

    if (!hasItem(state, data.itemId, 1)) return ActivityStartResult.NotPossible

    const time = selectMarketTime(state)
    startTimer(state, time, ActivityTypes.Market, id)

    return ActivityStartResult.Started
})
