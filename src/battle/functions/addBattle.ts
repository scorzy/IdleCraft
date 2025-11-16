import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { setState } from '../../game/setState'
import { BattleZoneEnum } from '../BattleZoneEnum'

export const makeBattle = (battleZoneEnum: BattleZoneEnum) => makeAddActivity(ActivityTypes.Battle, { battleZoneEnum })

export const addBattle = (battleZoneEnum: BattleZoneEnum) => setState((s) => makeBattle(battleZoneEnum)(s))
