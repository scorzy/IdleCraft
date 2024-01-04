import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { BattleAdapter } from '../BattleAdapter'
import { BattleZones } from '../BattleZones'

export function getBattleTitle(state: GameState, id: string) {
    const data = BattleAdapter.selectEx(state.battle, id)
    const battle = BattleZones[data.battleZoneEnum]
    const t = selectTranslations(state)
    return t.fun.fighting(battle.nameId)
}
