import { CastCharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { ActivityAdapter } from '../../activities/ActivityState'
import { removeActivityInt } from '../../activities/functions/removeActivity'
import { GameState } from '../../game/GameState'
import { removeTimer } from '../../timers/removeTimer'
import { TimerAdapter } from '../../timers/Timer'
import { CharacterAdapter } from '../characterAdapter'
import { PLAYER_ID } from '../charactersConst'

export function removeCharacter(state: GameState, characterId: string): void {
    if (characterId === PLAYER_ID) {
        killPlayer(state)
        return
    }

    CharacterAdapter.remove(state.characters, characterId)

    const toRemove: string[] = []
    CastCharAbilityAdapter.forEach(state.castCharAbility, (ability) => {
        if (ability.characterId !== characterId) return
        toRemove.push(ability.id)
    })

    TimerAdapter.forEach(state.timers, (tim) => {
        if (toRemove.some((r) => r === tim.actId)) removeTimer(state, tim.id)
    })

    toRemove.forEach((cca) => {
        CastCharAbilityAdapter.remove(state.castCharAbility, cca)
    })
}

function killPlayer(state: GameState): void {
    ActivityAdapter.forEach(state.activities, (act) => removeActivityInt(state, act.id))

    state.ui.deadDialog = true

    CharacterAdapter.selectEx(state.characters, PLAYER_ID).health = 1
}
