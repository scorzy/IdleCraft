import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { CastCharAbilityAdapter } from '../abilityAdapters'
import { execAbility } from './execAbility'

export function execAbilityTimer(state: GameState, timer: Timer) {
    const cast = CastCharAbilityAdapter.select(state.castCharAbility, timer.actId)
    if (!cast) return state

    CastCharAbilityAdapter.remove(state.castCharAbility, cast.id)

    execAbility(state, cast.abilityId, cast.characterId)
}
