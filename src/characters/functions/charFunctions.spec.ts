import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { PLAYER_ID } from '../charactersConst'
import { getCharacterSelector } from '../getCharacterSelector'
import { addHealth, addMana, addStamina } from './charFunctions'

describe('charFunctions', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    describe('addHealth', () => {
        it('adds the given amount to health', () => {
            state.characters.entries[PLAYER_ID]!.health = 10
            addHealth(state, PLAYER_ID, 5)
            expect(state.characters.entries[PLAYER_ID]!.health).toBe(15)
        })

        it('clamps health at the character max', () => {
            const max = getCharacterSelector(PLAYER_ID).MaxHealth(state)
            state.characters.entries[PLAYER_ID]!.health = max - 1
            addHealth(state, PLAYER_ID, 1000)
            expect(state.characters.entries[PLAYER_ID]!.health).toBe(max)
        })

        it('accepts a character object directly', () => {
            const char = state.characters.entries[PLAYER_ID]!
            char.health = 10
            addHealth(state, char, 5)
            expect(char.health).toBe(15)
        })
    })

    describe('addStamina', () => {
        it('adds the given amount to stamina', () => {
            state.characters.entries[PLAYER_ID]!.stamina = 10
            addStamina(state, PLAYER_ID, 5)
            expect(state.characters.entries[PLAYER_ID]!.stamina).toBe(15)
        })

        it('clamps stamina at the character max', () => {
            const max = getCharacterSelector(PLAYER_ID).MaxStamina(state)
            state.characters.entries[PLAYER_ID]!.stamina = max - 1
            addStamina(state, PLAYER_ID, 1000)
            expect(state.characters.entries[PLAYER_ID]!.stamina).toBe(max)
        })
    })

    describe('addMana', () => {
        it('adds the given amount to mana', () => {
            state.characters.entries[PLAYER_ID]!.mana = 10
            addMana(state, PLAYER_ID, 5)
            expect(state.characters.entries[PLAYER_ID]!.mana).toBe(15)
        })

        it('clamps mana at the character max', () => {
            const max = getCharacterSelector(PLAYER_ID).MaxMana(state)
            state.characters.entries[PLAYER_ID]!.mana = max - 1
            addMana(state, PLAYER_ID, 1000)
            expect(state.characters.entries[PLAYER_ID]!.mana).toBe(max)
        })
    })
})
