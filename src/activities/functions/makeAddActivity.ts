import { GameState } from '../../game/GameState'
import { addNotification } from '../../notification/addNotification'
import { getUniqueId } from '../../utils/getUniqueId'
import { ActivityState, ActivityAdapter, ActivityTypes } from '../ActivityState'
import { startNextActivity } from '../activityFunctions'

export const makeAddActivity =
    (type: ActivityTypes, add: (state: GameState, activityId: string) => GameState) => (state: GameState) => {
        const id = getUniqueId()

        const activity: ActivityState = {
            id: id,
            type: type,
            max: 1,
        }

        state = {
            ...state,
            activities: ActivityAdapter.create(state.activities, activity),
            orderedActivities: [...state.orderedActivities, id],
        }

        state = add(state, id)

        state.notifications = addNotification(state.notifications, { titleId: 'ActivityAdded' })

        if (state.orderedActivities.length === 1) state = startNextActivity(state)

        return state
    }
