import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { endActivity } from '../../activities/functions/endActivity'
import { isBattleEnded } from '../../battle/functions/isBattleEnded'
import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { endBattle } from './endBattle'

export function execAbility(state: GameState, abilityId: string, characterId: string): GameState {
    const abilityClass = ActiveAbilityData.getEx(abilityId)
    state = abilityClass.exec({ state, characterId })

    if (!state.activityId) return state
    if (!isBattleEnded(state)) return state

    const battleAct = ActivityAdapter.select(state.activities, state.activityId)
    if (!battleAct) return state
    if (battleAct.type !== ActivityTypes.Battle) return state
    state = endBattle(state)
    state = endActivity(state, battleAct.id, ActivityStartResult.Ended)

    return state
}
