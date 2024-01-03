import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { WoodTypes } from '../WoodTypes'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'

export const makeWoodcutting = (woodType: WoodTypes) =>
    makeAddActivity(ActivityTypes.Woodcutting, (state: GameState, activityId: string) => {
        return {
            ...state,
            woodcutting: WoodcuttingAdapter.create(state.woodcutting, {
                activityId,
                woodType,
            }),
        }
    })
