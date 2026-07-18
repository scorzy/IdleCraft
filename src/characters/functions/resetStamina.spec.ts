import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { PLAYER_ID } from '../charactersConst'
import { getCharacterSelector } from '../getCharacterSelector'
import { resetStamina } from './resetStamina'

describe('resetStamina', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('sets stamina to the max stamina of the character', () => {
        state.characters.entries[PLAYER_ID]!.stamina = 0
        resetStamina(state, PLAYER_ID)

        expect(state.characters.entries[PLAYER_ID]!.stamina).toBe(getCharacterSelector(PLAYER_ID).MaxStamina(state))
    })
})
