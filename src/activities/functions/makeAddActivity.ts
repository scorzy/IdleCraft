import { AddActivityTypes, GameState } from '../../game/GameState'
import { activityIcons, activityTitles } from '../../game/globals'
import { addNotification } from '../../notification/addNotification'
import { getUniqueId } from '../../utils/getUniqueId'
import { ActivityState, ActivityAdapter, ActivityTypes } from '../ActivityState'
import { startNextActivity } from '../activityFunctions'
import { removeActivityInt } from './removeActivity'
import { stopActivity } from './stopActivity'

const getCurActIndex = (state: GameState) => {
    let currentActId = -1
    if (state.activityId) currentActId = state.orderedActivities.indexOf(state.activityId)
    return currentActId
}

export const makeAddActivity =
    (type: ActivityTypes, data?: object, add?: (state: GameState, activityId: string) => GameState) =>
    (state: GameState) => {
        const id = getUniqueId()

        const activity: ActivityState = {
            id: id,
            type: type,
            max: state.actRepetitions,
            remove: state.actAutoRemove,
            ...data,
        }

        if (state.removeOtherActivities)
            ActivityAdapter.getIds(state.activities).forEach((id) => removeActivityInt(state, id))

        ActivityAdapter.create(state.activities, activity)

        switch (state.addActType) {
            case AddActivityTypes.Next:
                state.orderedActivities.splice(getCurActIndex(state), 0, id)
                break
            case AddActivityTypes.Before:
                state.orderedActivities.splice(Math.max(getCurActIndex(state) - 1, 0), 0, id)
                state.lastActivityDone++
                break
            case AddActivityTypes.First:
                state.orderedActivities.unshift(id)
                state.lastActivityDone++
                break
            case AddActivityTypes.Last:
                state.orderedActivities.push(id)
                break
        }

        if (add) add(state, id)

        const title = activityTitles.getEx(type)(state, id)
        const iconId = activityIcons.getEx(type)(state, id)

        addNotification(state.notifications, { title, iconId })

        if (state.startActNow && state.activityId) stopActivity(state, state.activityId)

        if (state.orderedActivities.length === 1 || state.startActNow) {
            state.activityId = id
            startNextActivity(state)
        }
    }
