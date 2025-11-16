import { GameState } from '../../game/GameState'

export const isBattleZoneSelected = (battleZoneEnum: string) => (state: GameState) =>
    state.ui.battleZone === battleZoneEnum
