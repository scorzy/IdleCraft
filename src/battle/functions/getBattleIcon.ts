import { GameState } from '../../game/GameState'
import { BattleZones } from '../BattleZones'
import { getBattleActivity } from '../selectors/battleSelectors'

export function getBattleIcon(state: GameState, id: string) {
    const data = getBattleActivity(state, id)
    const battle = BattleZones[data.battleZoneEnum]
    return battle.iconId
}
