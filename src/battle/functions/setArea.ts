import { useGameStore } from '../../game/state'
import { BattleZoneEnum } from '../BattleZoneEnum'

export const setArea = (battleZone: BattleZoneEnum) =>
    useGameStore.setState((s) => ({ ...s, ui: { ...s.ui, battleZone } }))
