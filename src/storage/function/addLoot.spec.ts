import { beforeEach, describe, expect, it, vi } from 'vitest'
import { MAX_LOOT } from '../../const'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { addLoot } from './addLoot'

describe('addLoot', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
    })

    it('adds loot with no probability to the current location', () => {
        addLoot(state, [{ itemId: 'DeadWolf', quantity: 1 }])

        const loot = GameLocationAdapter.selectEx(state.locations, state.location).loot
        expect(loot).toHaveLength(1)
        expect(loot[0]).toMatchObject({ itemId: 'DeadWolf', quantity: 1 })
        expect(loot[0]!.id).toBeTruthy()
    })

    it('adds newest loot at the front of the list', () => {
        addLoot(state, [{ itemId: 'DeadWolf', quantity: 1 }])
        addLoot(state, [{ itemId: 'DeadBoar', quantity: 1 }])

        const loot = GameLocationAdapter.selectEx(state.locations, state.location).loot
        expect(loot.map((l) => l.itemId)).toEqual(['DeadBoar', 'DeadWolf'])
    })

    it('stops adding once the location is at max loot capacity', () => {
        const loc = GameLocationAdapter.selectEx(state.locations, state.location)
        loc.loot = Array.from({ length: MAX_LOOT }, (_, i) => ({ id: `x${i}`, itemId: 'Filler', quantity: 1 }))

        addLoot(state, [{ itemId: 'DeadWolf', quantity: 1 }])

        expect(GameLocationAdapter.selectEx(state.locations, state.location).loot).toHaveLength(MAX_LOOT)
    })

    it('always drops loot when probability is 100', () => {
        addLoot(state, [{ itemId: 'DeadWolf', quantity: 1, probability: 100 }])

        expect(GameLocationAdapter.selectEx(state.locations, state.location).loot).toHaveLength(1)
    })

    it('never drops loot when the random roll exceeds probability', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0.999)

        addLoot(state, [{ itemId: 'DeadWolf', quantity: 1, probability: 1 }])

        expect(GameLocationAdapter.selectEx(state.locations, state.location).loot).toHaveLength(0)

        vi.restoreAllMocks()
    })
})
