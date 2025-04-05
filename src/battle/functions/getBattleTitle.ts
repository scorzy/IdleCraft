import { GameState } from '../../game/GameState'
import { selectTranslations } from '../../msg/useTranslations'
import { BattleZones } from '../BattleZones'
import { getBattleActivity } from '../selectors/battleSelectors'

export function getBattleTitle(state: GameState, id: string) {
    const data = getBattleActivity(state, id)
    const battle = BattleZones[data.battleZoneEnum]
    const t = selectTranslations(state)
    return t.fun.fighting(battle.nameId)
}
