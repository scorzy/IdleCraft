import { ActivityAdapter } from '../../activities/ActivityState'
import { removeActivityInt } from '../../activities/functions/removeActivity'
import { setState } from '../../game/setState'
import { useUiTempStore } from '../../ui/state/uiTempStore'
import { GameLocations } from '../GameLocations'

export const TRAVEL_TIME = 3000

export const travel = (location: GameLocations) => {
    if (useUiTempStore.getState().travelling) return

    setState((s) => {
        ActivityAdapter.forEach(s.activities, (act) => removeActivityInt(s, act.id))
    })

    const start = Date.now()
    useUiTempStore.setState({ travelling: { location, start, end: start + TRAVEL_TIME } })

    setTimeout(() => {
        setState((s) => {
            s.location = location
        })
        useUiTempStore.setState({ travelling: undefined })
    }, TRAVEL_TIME)
}
