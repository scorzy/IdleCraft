import { activityViewers } from '../../game/globals'
import { setState } from '../../game/setState'
import { ActivityAdapter } from '../ActivityState'

export const viewActivity = (id: string | undefined | null) => {
    if (!id) return
    setState((s) => {
        const activity = ActivityAdapter.select(s.activities, id)
        if (!activity) return
        const viewAction = activityViewers.get(activity.type)
        if (viewAction) viewAction(s, activity)
    })
}
