import { ActivityTypes } from '../../activities/ActivityState'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { removeCharacter } from '../../characters/functions/removeCharacter'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { TimerAdapter } from '../../timers/Timer'
import { removeTimer } from '../../timers/removeTimer'
import { CastCharAbilityAdapter } from '../abilityAdapters'

export function endBattle(state: GameState): GameState {
    const charIds = CharacterAdapter.getIds(state.characters)

    for (const charId of charIds) {
        const char = CharacterAdapter.selectEx(state.characters, charId)
        if (!char) continue
        if (char.isEnemy) state = removeCharacter(state, charId)
    }

    state = { ...state, castCharAbility: CastCharAbilityAdapter.getInitialState() }
    const timersIds = TimerAdapter.findMany(state.timers, (t) => t.type === ActivityTypes.Ability)
    timersIds?.forEach((tim) => {
        state = removeTimer(state, tim.id)
    })

    state = addBattleLog(state, {
        text: 'BattleFinished',
        iconId: Icons.CrossedSwords,
    })

    return state
}
