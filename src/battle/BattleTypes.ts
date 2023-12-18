import { BattleZoneEnum } from './BattleZoneEnum'
import { BattleZone } from './BattleZone'

export interface BattleAddType {
    battleZoneEnum: BattleZoneEnum
}
export interface BattleState extends BattleAddType {
    activityId: string
}
export interface BattleStateFull extends BattleState {
    battleZone: BattleZone
}
