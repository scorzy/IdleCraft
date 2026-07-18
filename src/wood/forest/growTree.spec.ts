import { beforeEach, describe, expect, it } from 'vitest'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { WoodTypes } from '../WoodTypes'
import { TreeGrowthAdapter } from './forestGrowth'
import { growTree } from './growTree'

describe('growTree', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
    })

    it('does nothing when the growth entry does not exist', () => {
        expect(() => growTree(state, 'missing')).not.toThrow()
        expect(state.timers.ids).toHaveLength(0)
    })

    it('removes the growth entry and adds a tree to the forest', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree] = {
            qta: 10,
            hp: 100,
        }
        TreeGrowthAdapter.create(state.treeGrowth, {
            id: 'growth-1',
            location: GameLocations.StartVillage,
            woodType: WoodTypes.DeadTree,
        })

        growTree(state, 'growth-1')

        expect(TreeGrowthAdapter.select(state.treeGrowth, 'growth-1')).toBeUndefined()
        expect(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree]!.qta
        ).toBe(11)
    })

    it('schedules a new growth timer when the forest is not yet full', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree] = {
            qta: 5,
            hp: 100,
        }
        TreeGrowthAdapter.create(state.treeGrowth, {
            id: 'growth-1',
            location: GameLocations.StartVillage,
            woodType: WoodTypes.DeadTree,
        })

        growTree(state, 'growth-1')

        expect(state.timers.ids.length).toBeGreaterThan(0)
    })
})
