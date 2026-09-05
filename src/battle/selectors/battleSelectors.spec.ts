import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { BattleZoneEnum } from '../BattleZoneEnum'
import { BattleState } from '../BattleTypes'
import { selectCurrentBattleActivityId, selectCurrentBattleZone } from './battleSelectors'

describe('selectCurrentBattleActivityId', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
    })

    it('returns the current activity only when it is a battle', () => {
        const battle: BattleState = {
            id: 'battle',
            type: ActivityTypes.Battle,
            max: 1,
            battleZoneEnum: BattleZoneEnum.Wolf,
        }
        ActivityAdapter.create(state.activities, battle)
        state.activityId = 'battle'

        expect(selectCurrentBattleActivityId(state)).toBe('battle')
    })

    it('returns undefined when the current activity is not a battle', () => {
        ActivityAdapter.create(state.activities, { id: 'craft', type: ActivityTypes.Crafting, max: 1 })
        state.activityId = 'craft'

        expect(selectCurrentBattleActivityId(state)).toBeUndefined()
        expect(selectCurrentBattleZone(state)).toBeUndefined()
    })

    it('returns the active battle zone', () => {
        const battle: BattleState = {
            id: 'battle',
            type: ActivityTypes.Battle,
            max: 1,
            battleZoneEnum: BattleZoneEnum.Wolf,
        }
        ActivityAdapter.create(state.activities, battle)
        state.activityId = 'battle'

        expect(selectCurrentBattleZone(state)).toBe(BattleZoneEnum.Wolf)
    })
})
