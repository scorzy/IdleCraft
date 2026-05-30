import { ActivityAdapter } from '../../activities/ActivityState'
import { removeActivityInt } from '../../activities/functions/removeActivity'
import { setState } from '../../game/setState'
import { GameLocations } from '../GameLocations'

export const travel = (location: GameLocations) => {
    setState((s) => {
        ActivityAdapter.forEach(s.activities, (act) => removeActivityInt(s, act.id))
        s.location = location
    })
}
