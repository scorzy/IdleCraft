import { test, describe, expect, afterEach, beforeEach, vi } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { WoodTypes } from '../WoodTypes'
import { addTree } from './forestFunctions'
import { cutTree } from './cutTree'
import { selectDefaultForest } from './forestSelectors'

describe('Forest Functions', () => {
    beforeEach(() => {
        vi.useFakeTimers()
    })
    afterEach(() => {
        vi.restoreAllMocks()
    })
    test('Add Tree', () => {
        let state = GetInitialGameState()
        state = addTree(state, WoodTypes.DeadTree, 1, state.location)
        expect(state.locations.StartVillage.forests).toEqual({})
    })
    test('Add Tree 2', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.forests.DeadTree = {
            qta: 2,
            hp: 1,
        }
        state = addTree(state, WoodTypes.DeadTree, 1, state.location)
        expect(state.locations.StartVillage.forests).toEqual({ DeadTree: { qta: 3, hp: 1 } })
    })
    test('Add Tree 3', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.forests.DeadTree = {
            qta: 2,
            hp: 1,
        }
        state = addTree(state, WoodTypes.DeadTree, 1e3, state.location)
        expect(state.locations.StartVillage.forests).toEqual({})
    })
    test('Cut Tree No', () => {
        const state = GetInitialGameState()
        const res = cutTree(state, WoodTypes.DeadTree, 1, state.location)
        const def = selectDefaultForest(WoodTypes.DeadTree)
        expect(res.state.locations.StartVillage.forests.DeadTree).toEqual({
            qta: def.qta,
            hp: def.hp - 1,
        })
        expect(res.cut).toBeFalsy()
    })
    test('Cut Tree Yes', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.forests.DeadTree = {
            qta: 2,
            hp: 1,
        }
        const res = cutTree(state, WoodTypes.DeadTree, 1, state.location)
        expect(res.state.locations.StartVillage.forests.DeadTree).toEqual({
            qta: 1,
            hp: selectDefaultForest(WoodTypes.DeadTree).hp,
        })
        expect(res.cut).toBeTruthy()
    })
})
