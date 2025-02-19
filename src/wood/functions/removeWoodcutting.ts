import { makeRemoveActivity } from '../../activities/functions/makeRemoveActivity'
import { GameState } from '../../game/GameState'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const removeWoodcutting = makeRemoveActivity((state: GameState, _activityId: string) => {
    return state
})
