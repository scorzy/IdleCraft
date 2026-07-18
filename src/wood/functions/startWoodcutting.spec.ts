import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Woodcutting } from '../Woodcutting'
import { WoodTypes } from '../WoodTypes'
import { startWoodcutting } from './startWoodcutting'

describe('startWoodcutting', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
        state.location = GameLocations.StartVillage
        const activity: Woodcutting = {
            id: 'act-1',
            type: ActivityTypes.Woodcutting,
            max: 1,
            remove: false,
            woodType: WoodTypes.DeadTree,
        }
        ActivityAdapter.create(state.activities, activity)
    })

    it('throws when the activity is not a woodcutting activity', () => {
        ActivityAdapter.create(state.activities, { id: 'act-2', type: ActivityTypes.Mining, max: 1, remove: false })

        expect(() => startWoodcutting(state, 'act-2')).toThrow()
    })

    it('starts a timer immediately when trees are available', () => {
        const result = startWoodcutting(state, 'act-1')

        expect(result).toBe(ActivityStartResult.Started)
        expect(state.waitingTrees).toBeNull()
        expect(state.timers.ids).toHaveLength(1)
        expect(state.timers.entries[state.timers.ids[0]!]!.type).toBe(ActivityTypes.Woodcutting)
    })

    it('marks the activity as waiting when the forest has no trees left', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree] = {
            qta: 0,
            hp: 100,
        }

        const result = startWoodcutting(state, 'act-1')

        expect(result).toBe(ActivityStartResult.Started)
        expect(state.waitingTrees).toBe('act-1')
        expect(state.timers.ids).toHaveLength(0)
    })
})
