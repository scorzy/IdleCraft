import { describe, expect, it } from 'vitest'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { sellItem } from './sellItem'

const getStorage = (state: GameState) => GameLocationAdapter.selectEx(state.locations, state.location).storage

describe('sellItem', () => {
    it('sells the requested quantity at item value and grants gold', () => {
        const state = GetInitialGameState()
        getStorage(state).ids = ['OakLog']
        getStorage(state).entries = { OakLog: { itemId: 'OakLog', quantity: 10 } }

        const gold = sellItem(state, 'OakLog', 4)

        expect(getStorage(state).entries['OakLog']?.quantity).toBe(6)
        expect(state.gold).toBe(gold)
        expect(gold).toBeGreaterThan(0)
    })

    it('does not apply capital market bonuses to quick sell', () => {
        const state = GetInitialGameState()
        state.location = GameLocations.CapitalCity
        getStorage(state).ids = ['OakLog']
        getStorage(state).entries = { OakLog: { itemId: 'OakLog', quantity: 1 } }

        const gold = sellItem(state, 'OakLog', 1)

        expect(gold).toBe(6)
    })

    it('clamps the sold quantity to what is actually in storage', () => {
        const state = GetInitialGameState()
        getStorage(state).ids = ['OakLog']
        getStorage(state).entries = { OakLog: { itemId: 'OakLog', quantity: 2 } }

        const gold = sellItem(state, 'OakLog', 100)

        expect(getStorage(state).entries['OakLog']).toBeUndefined()
        expect(state.gold).toBe(gold)
        expect(gold).toBeGreaterThan(0)
    })

    it('returns 0 and does nothing for an unlimited item', () => {
        const state = GetInitialGameState()

        const gold = sellItem(state, 'Water', 5)

        expect(gold).toBe(0)
        expect(state.gold).toBe(0)
    })

    it('returns 0 when there is nothing in storage to sell', () => {
        const state = GetInitialGameState()

        const gold = sellItem(state, 'OakLog', 5)

        expect(gold).toBe(0)
        expect(state.gold).toBe(0)
    })
})
