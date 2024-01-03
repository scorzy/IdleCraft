import { makeRemoveActivity } from '../../activities/functions/makeRemoveActivity'
import { GameState } from '../../game/GameState'
import { MiningAdapter } from '../MiningAdapter'

export const removeMining = makeRemoveActivity((state: GameState, activityId: string) => {
    return { ...state, mining: MiningAdapter.remove(state.mining, activityId) }
})
