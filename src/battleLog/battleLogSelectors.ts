import { GameState } from '../game/GameState'
import { BattleLogAdapter } from './battleLogAdapter'

export const selectBattleLogsIds = (state: GameState) => state.battleLogs.ids
export const selectBattleLog = (id: string) => (state: GameState) => BattleLogAdapter.selectEx(state.battleLogs, id)
