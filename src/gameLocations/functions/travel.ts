import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { removeActivityInt } from '../../activities/functions/removeActivity'
import { resetCaravanForm } from '../../caravans/functions/caravanFormFunctions'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { Timer } from '../../timers/Timer'
import { GameLocationAdapter } from '../GameLocationAdapter'
import { selectTravelTimer } from '../GameLocationSelectors'
import { GameLocations } from '../GameLocations'

export const TRAVEL_TIME = 3000

export function startTravel(state: GameState, location: GameLocations): void {
    if (selectTravelTimer(state)) return
    if (!GameLocationAdapter.select(state.locations, location)) return

    ActivityAdapter.forEach(state.activities, (activity) => removeActivityInt(state, activity.id))
    startTimer(state, TRAVEL_TIME, ActivityTypes.Travel, location)
}

export function execTravel(state: GameState, timer: Timer): void {
    if (timer.type !== ActivityTypes.Travel) return

    const destination = GameLocationAdapter.select(state.locations, timer.actId as GameLocations)
    if (!destination) return

    state.location = destination.id
    state.craftingForm = {
        recipeGroup: undefined,
        params: [],
        paramsValue: [],
        result: undefined,
        autoBuy: {},
    }
    resetCaravanForm(state)
    state.ui.marketItemId = null
}
