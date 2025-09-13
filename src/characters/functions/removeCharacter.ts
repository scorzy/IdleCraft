import { CastCharAbilityAdapter } from '../../activeAbilities/abilityAdapters'
import { ActivityAdapter } from '../../activities/ActivityState'
import { removeActivityInt } from '../../activities/functions/removeActivity'
import { GameState } from '../../game/GameState'
import { TimerAdapter } from '../../timers/Timer'
import { removeTimer } from '../../timers/removeTimer'
import { CharacterAdapter } from '../characterAdapter'
import { PLAYER_ID } from '../charactersConst'

export function removeCharacter(state: GameState, characterId: string): void {
    const character = CharacterAdapter.selectEx(state.characters, characterId)

    if (character.id === PLAYER_ID) killPlayer(state)

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
    const activities = ActivityAdapter.getIds(state.activities)
    for (const actId of activities) removeActivityInt(state, actId)

    state.ui.deadDialog = true

    CharacterAdapter.selectEx(state.characters, PLAYER_ID).health = 1
}
