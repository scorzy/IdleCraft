import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Mining } from '../Mining'
import { OreTypes } from '../OreTypes'
import { startMining } from './startMining'

describe('startMining', () => {
    let state: GameState

    beforeEach(() => {
        state = GetInitialGameState()
        state.location = GameLocations.StartVillage
        const activity: Mining = {
            id: 'act-1',
            type: ActivityTypes.Mining,
            max: 1,
            remove: false,
            oreType: OreTypes.Copper,
            isMining: false,
        }
        ActivityAdapter.create(state.activities, activity)
    })

    it('mines the current vein when one already exists at the location', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).oreVeins[OreTypes.Copper] = [
            { id: 'vein-1', oreType: OreTypes.Copper, qta: 3, maxQta: 3, hp: 50, maxHp: 50, armour: 0, gemChance: 0 },
        ]

        startMining(state, 'act-1')

        const data = ActivityAdapter.selectEx(state.activities, 'act-1') as Mining
        expect(data.activeVeinId).toBe('vein-1')
        expect(data.activeOreType).toBe(OreTypes.Copper)
        expect(data.isMining).toBe(true)
        expect(state.timers.ids).toHaveLength(1)
    })

    it('mines the base ore node when no vein exists and ore remains', () => {
        startMining(state, 'act-1')

        const data = ActivityAdapter.selectEx(state.activities, 'act-1') as Mining
        expect(data.activeVeinId).toBeUndefined()
        expect(data.activeOreType).toBe(OreTypes.Copper)
        expect(data.isMining).toBe(true)
        expect(state.timers.ids).toHaveLength(1)
    })

    it('waits without mining when the base ore node is depleted', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).ores[OreTypes.Copper] = {
            qta: 0,
            hp: 0,
        }

        startMining(state, 'act-1')

        const data = ActivityAdapter.selectEx(state.activities, 'act-1') as Mining
        expect(data.isMining).toBe(false)
        expect(state.timers.ids).toHaveLength(1)
    })
})
