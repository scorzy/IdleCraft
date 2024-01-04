import { ActivityTypes } from '../../activities/ActivityState'
import { makeAddActivity } from '../../activities/functions/makeAddActivity'
import { GameState } from '../../game/GameState'
import { useGameStore } from '../../game/state'
import { BattleAdapter } from '../BattleAdapter'
import { BattleZoneEnum } from '../BattleZoneEnum'

const makeBattle = (battleZoneEnum: BattleZoneEnum) =>
    makeAddActivity(ActivityTypes.Battle, (state: GameState, activityId: string) => {
        return {
            ...state,
            battle: BattleAdapter.create(state.battle, {
                activityId,
                battleZoneEnum,
            }),
        }
    })

export const addBattle = (battleZoneEnum: BattleZoneEnum) => useGameStore.setState((s) => makeBattle(battleZoneEnum)(s))
