import { describe, expect, it } from 'vitest'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { MARKET_BASE_TIME } from '../MarketConst'
import { selectMarketTime } from './marketTime'

describe('selectMarketTime', () => {
    it('returns the base market time outside the capital city', () => {
        const state = GetInitialGameState()

        expect(selectMarketTime(state)).toBe(MARKET_BASE_TIME)
    })

    it('reduces market time in the capital city', () => {
        const state = GetInitialGameState()
        state.location = GameLocations.CapitalCity

        expect(selectMarketTime(state)).toBe(MARKET_BASE_TIME * 0.8)
    })
})
