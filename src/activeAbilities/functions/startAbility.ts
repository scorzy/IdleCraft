import { GameState } from '../../game/GameState'
import { ActiveAbilityData } from '../ActiveAbilityData'
import { tryCast } from './tryCast'

export function startAbility(
    state: GameState,
    characterId: string,
    abilityId: string
): { state: GameState; done: boolean } {
    const ability = ActiveAbilityData.get(abilityId)
    if (!ability) throw new Error(`[execAbility] ${abilityId} not found`)

    const castRes = tryCast(state, characterId, abilityId)
    state = castRes.state
    if (!castRes.cast) return { done: false, state }

    return { done: true, state }
}
