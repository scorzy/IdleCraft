import { endBattle } from '../../activeAbilities/functions/endBattle'
import { makeRemoveActivity } from '../../activities/functions/makeRemoveActivity'
import { GameState } from '../../game/GameState'

export const removeBattle = makeRemoveActivity((state: GameState, activityId: string) => {
    if (state.activityId === activityId) state = endBattle(state)
    return state
})
