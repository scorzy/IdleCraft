import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { PLAYER_ID } from '../charactersConst'
import { getCharacterSelector } from '../getCharacterSelector'
import { resetMana } from './resetMana'

describe('resetMana', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('sets mana to the max mana of the character', () => {
        state.characters.entries[PLAYER_ID]!.mana = 0
        resetMana(state, PLAYER_ID)

        expect(state.characters.entries[PLAYER_ID]!.mana).toBe(getCharacterSelector(PLAYER_ID).MaxMana(state))
    })
})
