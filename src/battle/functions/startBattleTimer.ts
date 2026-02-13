import { ActivityAdapter } from '../../activities/ActivityState'
import { BattleLogType } from '../../battleLog/battleLogInterfaces'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { createEnemies } from '../../characters/functions/createEnemies'
import { startNextAbility } from '../../characters/functions/startNextAbility'
import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { isBattle } from '../BattleTypes'
import { BattleZones } from '../BattleZones'

export function startBattleTimer(state: GameState, timer: Timer): void {
    const data = ActivityAdapter.selectEx(state.activities, timer.actId)
    if (!data) {
        console.error(`[startBattleTimer] data not found ${timer.actId}`)
        return
    }
    if (!isBattle(data)) throw new Error(`Activity ${timer.actId} is not a battle`)

    const battleZone = BattleZones[data.battleZoneEnum]

    createEnemies(state, battleZone.enemies)
    addBattleLog(state, { type: BattleLogType.Start })

    const charIds = CharacterAdapter.getIds(state.characters)
    for (const charId of charIds) startNextAbility(state, charId)
}
