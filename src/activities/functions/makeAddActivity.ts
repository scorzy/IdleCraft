import { GameState } from '../../game/GameState'
import { activityIcons, activityTitles } from '../../game/globals'
import { addNotification } from '../../notification/addNotification'
import { getUniqueId } from '../../utils/getUniqueId'
import { ActivityState, ActivityAdapter, ActivityTypes } from '../ActivityState'
import { startNextActivity } from '../activityFunctions'

export const makeAddActivity =
    (type: ActivityTypes, data?: object, add?: (state: GameState, activityId: string) => GameState) =>
    (state: GameState) => {
        const id = getUniqueId()

        const activity: ActivityState = {
            id: id,
            type: type,
            max: 1,
            ...data,
        }

        console.log('Adding activity', activity)

        state = {
            ...state,
            activities: ActivityAdapter.create(state.activities, activity),
            orderedActivities: [...state.orderedActivities, id],
        }

        if (add) state = add(state, id)

        const title = activityTitles.getEx(type)(state, id)
        const iconId = activityIcons.getEx(type)(state, id)
        state.notifications = addNotification(state.notifications, { title, iconId })

        if (state.orderedActivities.length === 1) state = startNextActivity(state)

        return state
    }
