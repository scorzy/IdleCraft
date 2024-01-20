import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { endActivity } from '../../activities/functions/endActivity'
import { isBattleEnded } from '../../battle/functions/isBattleEnded'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { startNextAbility } from '../../characters/functions/startNextAbility'
import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { AbilitiesEnum } from '../abilitiesEnum'
import { endBattle } from './endBattle'

export function execAbility(state: GameState, abilityId: AbilitiesEnum, characterId: string): GameState {
    const abilityClass = ActiveAbilityData.getEx(abilityId)
    state = abilityClass.exec({ state, characterId })

    if (!state.activityId) return state
    if (!isBattleEnded(state)) {
        const cast2 = CharacterAdapter.select(state.characters, characterId)
        if (cast2) state = startNextAbility(state, characterId)
        return state
    }

    const battleAct = ActivityAdapter.select(state.activities, state.activityId)
    if (!battleAct) return state
    if (battleAct.type !== ActivityTypes.Battle) return state
    state = endBattle(state)
    state = endActivity(state, battleAct.id, ActivityStartResult.Ended)

    return state
}
