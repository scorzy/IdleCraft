import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityState, ActivityTypes } from '../../activities/ActivityState'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { OreTypes } from '../OreTypes'
import { SEARCH_ORE_VEIN_TIME, startMiningVeinSearch } from './startMiningVeinSearch'

describe('startMiningVeinSearch', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
        const activity: ActivityState & { oreType: OreTypes } = {
            id: 'act-1',
            type: ActivityTypes.MiningVeinSearch,
            max: 1,
            remove: false,
            oreType: OreTypes.Copper,
        }
        ActivityAdapter.create(state.activities, activity)
    })

    it('uses the base ore vein search time outside the mountain village', () => {
        startMiningVeinSearch(state, 'act-1')

        const timer = state.timers.entries[state.timers.ids[0]!]
        expect(timer!.to - timer!.from).toBe(SEARCH_ORE_VEIN_TIME)
    })

    it('reduces ore vein search time in the mountain village', () => {
        state.location = GameLocations.MountainVillage

        startMiningVeinSearch(state, 'act-1')

        const timer = state.timers.entries[state.timers.ids[0]!]
        expect(timer!.to - timer!.from).toBe(SEARCH_ORE_VEIN_TIME * 0.8)
    })
})
