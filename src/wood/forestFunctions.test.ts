import { test, describe, expect } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { addTree, cutTree, selectDefaultForest } from './forestFunctions'
import { WoodTypes } from './WoodTypes'

describe('Forest Functions', () => {
    test('Add Tree', () => {
        let state = GetInitialGameState()
        state = addTree(state, WoodTypes.Fir, 1, state.location)
        expect(state.locations.StartVillage.forests).toEqual({})
    })
    test('Add Tree 2', () => {
        let state = GetInitialGameState()
        state.locations.StartVillage.forests.Fir = {
            qta: 2,
            hp: 1,
        }
        state = addTree(state, WoodTypes.Fir, 1, state.location)
        expect(state.locations.StartVillage.forests).toEqual({ Fir: { qta: 3, hp: 1 } })
    })
    test('Add Tree 3', () => {
        let state = GetInitialGameState()
        const def = selectDefaultForest(WoodTypes.Fir)
        state.locations.StartVillage.forests.Fir = {
            qta: 2,
            hp: 1,
        }
        state = addTree(state, WoodTypes.Fir, 1e3, state.location)
        expect(state.locations.StartVillage.forests).toEqual({})
    })
    test('Cut Tree No', () => {
        const state = GetInitialGameState()
        const res = cutTree(state, WoodTypes.Fir, 1, state.location)
        const def = selectDefaultForest(WoodTypes.Fir)
        expect(res.state.locations.StartVillage.forests.Fir).toEqual({
            qta: def.qta,
            hp: def.hp - 1,
        })
        expect(res.cut).toBeFalsy()
    })
    test('Cut Tree Yes', () => {
        const state = GetInitialGameState()
        state.locations.StartVillage.forests.Fir = {
            qta: 2,
            hp: 1,
        }
        const res = cutTree(state, WoodTypes.Fir, 1, state.location)
        expect(res.state.locations.StartVillage.forests.Fir).toEqual({
            qta: 1,
            hp: selectDefaultForest(WoodTypes.Fir).hp,
        })
        expect(res.cut).toBeTruthy()
    })
})
