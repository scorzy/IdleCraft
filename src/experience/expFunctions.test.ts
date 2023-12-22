import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { PLAYER_ID } from '../characters/charactersConst'
import { CharacterStateAdapter } from '../characters/characterAdapter'
import { addExp } from './expFunctions'
import { ExpEnum } from './expEnum'

describe('Exp Functions', () => {
    test('addExp', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 1)
        const char = CharacterStateAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(1)
        expect(char.skillsLevel[ExpEnum.Mining] ?? 0).toEqual(0)
    })
    test('addExp level', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 100)
        const char = CharacterStateAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(100)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(1)
    })
    test('addExp level 2', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 100)
        state = addExp(state, ExpEnum.Mining, 110)
        const char = CharacterStateAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(210)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(2)
    })
})
