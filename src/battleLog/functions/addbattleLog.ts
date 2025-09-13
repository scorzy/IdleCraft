import { getCharacterSelector } from '../../characters/getCharacterSelector'
import { GameState } from '../../game/GameState'
import { getUniqueId } from '../../utils/getUniqueId'
import { BattleLogAdapter } from '../battleLogAdapter'
import { AddBattleLog, AddKillBattleLog, BattleLog, BattleLogType } from '../battleLogInterfaces'

const MAX_LOGS = 100

export function addBattleLog(state: GameState, addLog: AddBattleLog): void {
    const battleLog: BattleLog = { ...addLog, id: getUniqueId(), date: state.now }

    let battleLogs = BattleLogAdapter.create(state.battleLogs, battleLog)

    while (battleLogs.ids.length > MAX_LOGS) {
        const id = battleLogs.ids[0]
        if (id) battleLogs = BattleLogAdapter.remove(battleLogs, id)
    }
}
export function addKillBattleLog(state: GameState, targetId: string): void {
    const selector = getCharacterSelector(targetId)
    const targets = selector.Name(state)
    const killLog: AddKillBattleLog = { type: BattleLogType.Kill, targets }
    addBattleLog(state, killLog)
}
