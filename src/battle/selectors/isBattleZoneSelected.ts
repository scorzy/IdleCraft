import { GameState } from '../../game/GameState'
import { BattleZoneEnum } from '../BattleZoneEnum'

export const isBattleZoneSelected = (battleZoneEnum: BattleZoneEnum) => (state: GameState) =>
    state.ui.battleZone === battleZoneEnum
