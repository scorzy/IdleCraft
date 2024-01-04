import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { WoodTypes } from '../WoodTypes'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'

const makeWoodcutting = (woodType: WoodTypes) =>
    makeAddActivity(ActivityTypes.Woodcutting, (state: GameState, activityId: string) => {
        return {
            ...state,
            woodcutting: WoodcuttingAdapter.create(state.woodcutting, {
                activityId,
                woodType,
            }),
        }
    })

export const addWoodcutting = (woodType: WoodTypes) => useGameStore.setState((s) => makeWoodcutting(woodType)(s))
