import { GameState } from '../../game/GameState'
import { getUniqueId } from '../../utils/getUniqueId'
import { BattleLogAdapter } from '../battleLogAdapter'
import { AddBattleLog, BattleLog } from '../battleLogInterfaces'

const MAX_LOGS = 10

export function addBattleLog(state: GameState, addLog: AddBattleLog) {
    const battleLog: BattleLog = { ...addLog, id: getUniqueId(), date: state.now }

    let battleLogs = BattleLogAdapter.create(state.battleLogs, battleLog)

    const maxLogs = MAX_LOGS

    while (battleLogs.ids.length > maxLogs) {
        const id = battleLogs.ids[0]
        if (id) battleLogs = BattleLogAdapter.remove(battleLogs, id)
    }
    state = { ...state, battleLogs }
    return state
}
