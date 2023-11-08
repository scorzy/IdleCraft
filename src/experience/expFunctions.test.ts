import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { addExp } from './expFunctions'
import { ExpEnum } from './expEnum'

describe('Exp Functions', () => {
    test('addExp', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 1)
        expect(state.exp[ExpEnum.Mining]?.exp).toEqual(1)
        expect(state.exp[ExpEnum.Mining]?.level).toEqual(0)
    })
    test('addExp level', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 100)
        expect(state.exp[ExpEnum.Mining]?.exp).toEqual(100)
        expect(state.exp[ExpEnum.Mining]?.level).toEqual(1)
    })
    test('addExp level 2', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 100)
        state = addExp(state, ExpEnum.Mining, 110)
        expect(state.exp[ExpEnum.Mining]?.exp).toEqual(210)
        expect(state.exp[ExpEnum.Mining]?.level).toEqual(2)
    })
})
