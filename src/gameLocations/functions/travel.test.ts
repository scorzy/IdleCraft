import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { ActivityTypes } from '../../activities/ActivityState'
import { CaravanTierId } from '../../caravans/CaravanConst'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { onTimer } from '../../timers/onTimer'
import { selectTravelTimer } from '../GameLocationSelectors'
import { GameLocations } from '../GameLocations'
import { startTravel, TRAVEL_TIME } from './travel'

describe('travel', () => {
    let state: GameState

    beforeAll(() => initialize())

    beforeEach(() => {
        state = GetInitialGameState()
        state.now = 1_000
        state.isTimer = true
    })

    it('starts a travel timer without changing location immediately', () => {
        startTravel(state, GameLocations.WoodVillage)

        const timer = selectTravelTimer(state)
        expect(timer).toMatchObject({
            from: 1_000,
            to: 1_000 + TRAVEL_TIME,
            type: ActivityTypes.Travel,
            actId: GameLocations.WoodVillage,
        })
        expect(state.location).toBe(GameLocations.StartVillage)
    })

    it('does not start another journey while travelling', () => {
        startTravel(state, GameLocations.WoodVillage)
        startTravel(state, GameLocations.CapitalCity)

        expect(state.timers.ids).toHaveLength(1)
        expect(selectTravelTimer(state)?.actId).toBe(GameLocations.WoodVillage)
    })

    it('completes travel through the timer executor and resets location-specific forms', () => {
        state.craftingForm.autoBuy = { OakLog: true }
        state.caravanDispatchForm = {
            toId: GameLocations.CapitalCity,
            tierId: CaravanTierId.Standard,
            cargo: [{ itemId: 'OakLog', quantity: 2 }],
        }
        state.ui.marketItemId = 'OakLog'

        startTravel(state, GameLocations.WoodVillage)
        const timer = selectTravelTimer(state)
        if (!timer) throw new Error('Travel timer not found')

        onTimer(state, timer.id)

        expect(state.location).toBe(GameLocations.WoodVillage)
        expect(selectTravelTimer(state)).toBeUndefined()
        expect(state.craftingForm).toEqual({
            recipeGroup: undefined,
            params: [],
            paramsValue: [],
            result: undefined,
            autoBuy: {},
        })
        expect(state.caravanDispatchForm).toEqual({ toId: undefined, tierId: undefined, cargo: [] })
        expect(state.ui.marketItemId).toBeNull()
    })
})
