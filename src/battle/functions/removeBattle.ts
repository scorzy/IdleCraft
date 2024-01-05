import { endBattle } from '../../activeAbilities/functions/endBattle'
import { makeRemoveActivity } from '../../activities/functions/makeRemoveActivity'
import { GameState } from '../../game/GameState'
import { BattleAdapter } from '../BattleAdapter'

export const removeBattle = makeRemoveActivity((state: GameState, activityId: string) => {
    if (state.activityId === activityId) state = endBattle(state)
    return { ...state, battle: BattleAdapter.remove(state.battle, activityId) }
})
