import { GameState } from '../../game/GameState'
import { BattleAdapter } from '../BattleAdapter'
import { BattleZones } from '../BattleZones'

export function getBattleIcon(state: GameState, id: string) {
    const data = BattleAdapter.selectEx(state.battle, id)
    const battle = BattleZones[data.battleZoneEnum]
    return battle.iconId
}
