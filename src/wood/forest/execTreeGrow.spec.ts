import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityTypes } from '../../activities/ActivityState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Timer } from '../../timers/Timer'
import { WoodTypes } from '../WoodTypes'
import { TreeGrowthAdapter } from './forestGrowth'
import { execTreeGrow } from './execTreeGrow'

describe('execTreeGrow', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree] = {
            qta: 10,
            hp: 100,
        }
        TreeGrowthAdapter.create(state.treeGrowth, {
            id: 'growth-1',
            location: GameLocations.StartVillage,
            woodType: WoodTypes.DeadTree,
        })
    })

    it('grows the tree for the timer activity id', () => {
        const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.Tree, actId: 'growth-1' }

        execTreeGrow(state, timer)

        expect(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree]!.qta
        ).toBe(11)
    })

    it('does not advance activities when not waiting on this activity', () => {
        state.waitingTrees = null
        state.activityId = 'some-activity'
        const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.Tree, actId: 'growth-1' }

        expect(() => execTreeGrow(state, timer)).not.toThrow()
    })
})
