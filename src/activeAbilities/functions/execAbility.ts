import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { tryCast } from './canCast'

export function execAbility(state: GameState, characterId: string, abilityId: string): GameState {
    const ability = ActiveAbilityData.get(abilityId)
    if (!ability) throw new Error(`[execAbility] ${abilityId} not found`)

    const castRes = tryCast(state, characterId, abilityId)
    state = castRes.state
    if (!castRes.cast) return state

    return state
}
