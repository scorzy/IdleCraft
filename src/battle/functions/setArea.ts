import { setState } from '../../game/setState'
import { BattleZoneEnum } from '../BattleZoneEnum'

export const setArea = (battleZone: BattleZoneEnum) =>
    setState((s) => {
        s.ui.battleZone = battleZone
    })
