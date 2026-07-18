import { beforeEach, describe, expect, it } from 'vitest'
import { CharacterAdapter } from '../../characters/characterAdapter'
import { PLAYER_ID } from '../../characters/charactersConst'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { AbilitiesEnum } from '../abilitiesEnum'
import { tryCast } from './tryCast'

describe('tryCast', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
    })

    it('throws when the ability does not exist', () => {
        expect(() => tryCast(state, PLAYER_ID, 'not-an-ability' as AbilitiesEnum)).toThrow()
    })

    it('succeeds and leaves resources unchanged for a free ability', () => {
        const before = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        const { health, stamina, mana } = before

        const result = tryCast(state, PLAYER_ID, AbilitiesEnum.NormalAttack)

        expect(result).toBe(true)
        const after = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        expect(after.health).toBe(health)
        expect(after.stamina).toBe(stamina)
        expect(after.mana).toBe(mana)
    })

    it('deducts stamina cost and fails when stamina is insufficient', () => {
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        char.stamina = 0

        const result = tryCast(state, PLAYER_ID, AbilitiesEnum.ChargedAttack)

        expect(result).toBe(false)
    })

    it('succeeds and deducts stamina when enough is available', () => {
        const char = CharacterAdapter.selectEx(state.characters, PLAYER_ID)
        char.stamina = 1e6

        const result = tryCast(state, PLAYER_ID, AbilitiesEnum.ChargedAttack)

        expect(result).toBe(true)
        expect(CharacterAdapter.selectEx(state.characters, PLAYER_ID).stamina).toBeLessThan(1e6)
    })
})
