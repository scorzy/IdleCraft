import { setState } from '../../game/state'
import { BattleZoneEnum } from '../BattleZoneEnum'

export const setArea = (battleZone: BattleZoneEnum) =>
    setState((s) => {
        s.ui.battleZone = battleZone
    })
