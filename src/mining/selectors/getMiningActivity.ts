import { ActivityAdapter, ActivityState } from '../../activities/ActivityState'
import { InitialState } from '../../entityAdapter/InitialState'
import { isMining, Mining } from '../Mining'

export function getMiningActivity(activities: InitialState<ActivityState>, id: string): Mining {
    const data = ActivityAdapter.selectEx(activities, id)
    if (!isMining(data)) throw new Error(`[getMiningIcon]: ${id} is not a mining activity`)
    return data
}
