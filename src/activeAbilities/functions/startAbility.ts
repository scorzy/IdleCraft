import { ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { getUniqueId } from '../../utils/getUniqueId'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { AbilitiesEnum } from '../abilitiesEnum'
import { CastCharAbilityAdapter } from '../abilityAdapters'
import { tryCast } from './tryCast'

export function startAbility(state: GameState, characterId: string, abilityId: AbilitiesEnum): boolean {
    const ability = ActiveAbilityData.getEx(abilityId)

    const done = tryCast(state, characterId, abilityId)

    if (!done) return false

    const id = getUniqueId()
    CastCharAbilityAdapter.create(state.castCharAbility, {
        id,
        abilityId,
        characterId,
    })

    const time = ability.getChargeTime({ state, characterId })
    startTimer(state, time, ActivityTypes.Ability, id)

    return true
}
