import { ActivityTypes } from '../../activities/ActivityState'
import { BattleLogType } from '../../battleLog/battleLogInterfaces'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { removeCharacter } from '../../characters/functions/removeCharacter'
import { GameState } from '../../game/GameState'
import { removeTimer } from '../../timers/removeTimer'
import { TimerAdapter } from '../../timers/Timer'
import { CastCharAbilityAdapter } from '../abilityAdapters'

export function endBattle(state: GameState) {
    CharacterAdapter.forEach(state.characters, (char) => {
        if (!char) return
        if (char.isEnemy) removeCharacter(state, char.id)
    })
    state.castCharAbility = CastCharAbilityAdapter.getInitialState()

    const timersIds = TimerAdapter.findMany(state.timers, (t) => t.type === ActivityTypes.Ability)
    timersIds?.forEach((tim) => {
        removeTimer(state, tim.id)
    })

    addBattleLog(state, { type: BattleLogType.End })
}
