import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { WoodTypes } from '../WoodTypes'
import { cutTree } from './cutTree'
import { addTree } from './forestFunctions'
import { selectDefaultForest } from './forestSelectors'

const getStartVillage = (state: ReturnType<typeof GetInitialGameState>) =>
    GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage)

describe('Forest Functions', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    test('Add Tree', () => {
        const state = GetInitialGameState()
        addTree(state, WoodTypes.DeadTree, 1, state.location)
        expect(getStartVillage(state).forests).toEqual({})
    })
    test('Add Tree 2', () => {
        const state = GetInitialGameState()
        getStartVillage(state).forests.DeadTree = {
            qta: 2,
            hp: 1,
        }
        addTree(state, WoodTypes.DeadTree, 1, state.location)
        expect(getStartVillage(state).forests).toEqual({ DeadTree: { qta: 3, hp: 1 } })
    })
    test('Add Tree 3', () => {
        const state = GetInitialGameState()
        getStartVillage(state).forests.DeadTree = {
            qta: 2,
            hp: 1,
        }
        addTree(state, WoodTypes.DeadTree, 1e3, state.location)
        expect(getStartVillage(state).forests).toEqual({})
    })
    test('Cut Tree No', () => {
        const state = GetInitialGameState()
        const res = cutTree(state, WoodTypes.DeadTree, 1, state.location)
        const def = selectDefaultForest(state, WoodTypes.DeadTree)
        expect(getStartVillage(state).forests.DeadTree).toEqual({
            qta: def.qta,
            hp: def.hp - 1,
        })
        expect(res.cut).toBeFalsy()
    })
    test('Cut Tree Yes', () => {
        const state = GetInitialGameState()
        getStartVillage(state).forests.DeadTree = {
            qta: 2,
            hp: 1,
        }
        const res = cutTree(state, WoodTypes.DeadTree, 1, state.location)
        expect(getStartVillage(state).forests.DeadTree).toEqual({
            qta: 1,
            hp: selectDefaultForest(state, WoodTypes.DeadTree).hp,
        })
        expect(res.cut).toBeTruthy()
    })
    test('Cutting the first ever tree of a full forest starts regrowth immediately', () => {
        const state = GetInitialGameState()
        const def = selectDefaultForest(state, WoodTypes.DeadTree)
        const res = cutTree(state, WoodTypes.DeadTree, def.hp, state.location)
        expect(res.cut).toBeTruthy()
        expect(getStartVillage(state).forests.DeadTree?.qta).toBe(def.qta - 1)
        expect(state.treeGrowth.ids).toHaveLength(1)
    })
})
