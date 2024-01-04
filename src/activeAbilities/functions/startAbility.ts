import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { getUniqueId } from '../../utils/getUniqueId'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { CastCharAbilityAdapter } from '../abilityAdapters'
import { tryCast } from './tryCast'

export function startAbility(
    state: GameState,
    characterId: string,
    abilityId: string
): { state: GameState; done: boolean } {
    const ability = ActiveAbilityData.getEx(abilityId)

    const castRes = tryCast(state, characterId, abilityId)
    state = castRes.state
    if (!castRes.cast) return { done: false, state }

    const id = getUniqueId()
    state = {
        ...state,
        castCharAbility: CastCharAbilityAdapter.create(state.castCharAbility, {
            id,
            abilityId,
            characterId,
        }),
    }

    const time = ability.getChargeTime({ state, characterId })
    state = startTimer(state, time, ActivityTypes.Ability, id)

    return { done: true, state }
}
