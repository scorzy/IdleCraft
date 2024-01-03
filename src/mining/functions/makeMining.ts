import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { MiningAdapter } from '../MiningAdapter'
import { OreTypes } from '../OreTypes'

export const makeMining = (oreType: OreTypes) =>
    makeAddActivity(ActivityTypes.Mining, (state: GameState, activityId: string) => {
        return {
            ...state,
            mining: MiningAdapter.create(state.mining, {
                activityId,
                oreType,
                isMining: true,
            }),
        }
    })
