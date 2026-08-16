import { describe, expect, it } from 'vitest'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ExpEnum } from '../../experience/ExpEnum'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { PerksEnum } from '../../perks/perksEnum'
import { HIGH_PRICES_PERK, PERSUASION_VALUE_PER_LEVEL } from '../MarketConst'
import { selectSaleValueAll } from './saleValue'

describe('selectSaleValueAll', () => {
    it('returns the plain item value with no level or perk bonuses', () => {
        const state = GetInitialGameState()

        const result = selectSaleValueAll('OakLog')(state)

        expect(result.total).toBe(6)
    })

    it('returns an empty bonus result for an unknown item', () => {
        const state = GetInitialGameState()

        const result = selectSaleValueAll('DoesNotExist')(state)

        expect(result).toEqual({ total: 0, bonuses: [] })
    })

    it('increases value with Persuasion level', () => {
        const state = GetInitialGameState()
        state.characters.entries[PLAYER_ID]!.skillsLevel[ExpEnum.Persuasion] = 10

        const result = selectSaleValueAll('OakLog')(state)

        expect(result.total).toBeCloseTo(6 * (1 + (10 * PERSUASION_VALUE_PER_LEVEL) / 100))
    })

    it('increases value with the HIGH_PRICES perk', () => {
        const state = GetInitialGameState()
        state.characters.entries[PLAYER_ID]!.perks[PerksEnum.HIGH_PRICES] = 1

        const result = selectSaleValueAll('OakLog')(state)

        expect(result.total).toBeCloseTo(6 * (1 + HIGH_PRICES_PERK / 100))
    })

    it('increases value for market activities in the capital city', () => {
        const state = GetInitialGameState()
        state.location = GameLocations.CapitalCity

        const result = selectSaleValueAll('OakLog')(state)

        expect(result.total).toBeCloseTo(6 * 1.2)
    })

    it('composes Persuasion level and the HIGH_PRICES perk multiplicatively', () => {
        const state = GetInitialGameState()
        state.characters.entries[PLAYER_ID]!.skillsLevel[ExpEnum.Persuasion] = 10
        state.characters.entries[PLAYER_ID]!.perks[PerksEnum.HIGH_PRICES] = 1

        const result = selectSaleValueAll('OakLog')(state)

        expect(result.total).toBeCloseTo(
            6 * (1 + (10 * PERSUASION_VALUE_PER_LEVEL) / 100) * (1 + HIGH_PRICES_PERK / 100)
        )
    })
})
