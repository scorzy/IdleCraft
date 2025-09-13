import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { endActivity } from '../../activities/functions/endActivity'
import { isBattleEnded } from '../../battle/selectors/isBattleEnded'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { startNextAbility } from '../../characters/functions/startNextAbility'
import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { AbilitiesEnum } from '../abilitiesEnum'
import { endBattle } from './endBattle'

export function execAbility(state: GameState, abilityId: AbilitiesEnum, characterId: string) {
    const abilityClass = ActiveAbilityData.getEx(abilityId)
    abilityClass.exec({ state, characterId })

    if (!state.activityId) return state
    if (!isBattleEnded(state)) {
        const cast2 = CharacterAdapter.select(state.characters, characterId)
        if (cast2) startNextAbility(state, characterId)
        return
    }

    const battleAct = ActivityAdapter.select(state.activities, state.activityId)
    if (!battleAct) return state
    if (battleAct.type !== ActivityTypes.Battle) return state

    endBattle(state)
    endActivity(state, battleAct.id, ActivityStartResult.Ended)
}
