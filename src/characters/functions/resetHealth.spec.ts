import { beforeEach, describe, expect, it } from 'vitest'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { PLAYER_ID } from '../charactersConst'
import { getCharacterSelector } from '../getCharacterSelector'
import { resetHealth } from './resetHealth'

describe('resetHealth', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('sets health to the max health of the character', () => {
        state.characters.entries[PLAYER_ID]!.health = 1
        resetHealth(state, PLAYER_ID)

        expect(state.characters.entries[PLAYER_ID]!.health).toBe(getCharacterSelector(PLAYER_ID).MaxHealth(state))
    })

    it('overrides an overhealed value down to max health', () => {
        const max = getCharacterSelector(PLAYER_ID).MaxHealth(state)
        state.characters.entries[PLAYER_ID]!.health = max + 1000
        resetHealth(state, PLAYER_ID)

        expect(state.characters.entries[PLAYER_ID]!.health).toBe(max)
    })
})
