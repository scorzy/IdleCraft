import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { useGameStore } from '../../game/state'
import { BattleZoneEnum } from '../BattleZoneEnum'

const makeBattle = (battleZoneEnum: BattleZoneEnum) => makeAddActivity(ActivityTypes.Battle, { battleZoneEnum })

export const addBattle = (battleZoneEnum: BattleZoneEnum) => useGameStore.setState((s) => makeBattle(battleZoneEnum)(s))
