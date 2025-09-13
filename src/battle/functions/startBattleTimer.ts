import { BattleLogType } from '../../battleLog/battleLogInterfaces'
import { addBattleLog } from '../../battleLog/functions/addBattleLog'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { createEnemies } from '../../characters/functions/createEnemies'
import { startNextAbility } from '../../characters/functions/startNextAbility'
import { GameState } from '../../game/GameState'
import { Timer } from '../../timers/Timer'
import { BattleZones } from '../BattleZones'
import { getBattleActivity } from '../selectors/battleSelectors'

export function startBattleTimer(state: GameState, timer: Timer): void {
    const data = getBattleActivity(state, timer.actId)
    const battleZone = BattleZones[data.battleZoneEnum]

    createEnemies(state, battleZone.enemies)
    addBattleLog(state, { type: BattleLogType.Start })

    const charIds = CharacterAdapter.getIds(state.characters)
    for (const charId of charIds) startNextAbility(state, charId)
}
