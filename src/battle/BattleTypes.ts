import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { BattleZoneEnum } from './BattleZoneEnum'

export type BattleState = ActivityState & {
    battleZoneEnum: BattleZoneEnum
}
export function isBattle(act: ActivityState | BattleState): act is BattleState {
    return act.type === ActivityTypes.Battle
}
