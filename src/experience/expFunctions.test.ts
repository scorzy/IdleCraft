import { describe, expect, test } from 'vitest'
import { GetInitialGameState } from '../game/InitialGameState'
import { PLAYER_ID } from '../characters/charactersConst'
import { CharacterAdapter } from '../characters/characterAdapter'
import { addExp } from './expFunctions'
import { ExpEnum } from './ExpEnum'
import { getLevelExp } from './expSelectors'

describe('Exp Functions', () => {
    test('getLevelExp 1', () => {
        expect(getLevelExp(1)).toEqual(1000)
    })
    test('getLevelExp 2', () => {
        expect(getLevelExp(2)).toEqual(2200)
    })
    test('addExp', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 1)
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(1)
        expect(char.skillsLevel[ExpEnum.Mining] ?? 0).toEqual(0)
        expect(char.level).toEqual(0)
        expect(char.exp).toEqual(1)
    })
    test('addExp level 0', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 100)
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(100)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(0)
        expect(char.level).toEqual(0)
        expect(char.exp).toEqual(100)
    })
    test('addExp level', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 1000)
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(1000)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(1)
        expect(char.level).toEqual(0)
        expect(char.exp).toEqual(1000)
    })
    test('addExp level 2', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 1000)
        state = addExp(state, ExpEnum.Mining, 1200)
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(2200)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(2)
        expect(char.level).toEqual(0)
        expect(char.exp).toEqual(2200)
    })
    test('addExp char level 1', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 5000)
        state = addExp(state, ExpEnum.Archery, 5000)
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(5000)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(3)
        expect(char.skillsExp[ExpEnum.Archery]).toEqual(5000)
        expect(char.skillsLevel[ExpEnum.Archery]).toEqual(3)
        expect(char.level).toEqual(1)
        expect(char.exp).toEqual(10000)
    })
    test('addExp char level 0', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 4999)
        state = addExp(state, ExpEnum.Archery, 5000)
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(4999)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(3)
        expect(char.skillsExp[ExpEnum.Archery]).toEqual(5000)
        expect(char.skillsLevel[ExpEnum.Archery]).toEqual(3)
        expect(char.level).toEqual(0)
        expect(char.exp).toEqual(9999)
    })
    test('addExp char level 1', () => {
        let state = GetInitialGameState()
        state = addExp(state, ExpEnum.Mining, 5000)
        state = addExp(state, ExpEnum.Archery, 5000)
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(char.skillsExp[ExpEnum.Mining]).toEqual(5000)
        expect(char.skillsLevel[ExpEnum.Mining]).toEqual(3)
        expect(char.skillsExp[ExpEnum.Archery]).toEqual(5000)
        expect(char.skillsLevel[ExpEnum.Archery]).toEqual(3)
        expect(char.level).toEqual(1)
        expect(char.exp).toEqual(10000)
    })
})
