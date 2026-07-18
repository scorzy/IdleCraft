import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { ExpEnum } from '../../experience/ExpEnum'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { Timer } from '../../timers/Timer'
import { Mining } from '../Mining'
import { OreTypes } from '../OreTypes'
import { execMining } from './execMining'

describe('execMining', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
        state.location = GameLocations.StartVillage
    })

    const makeActivity = (overrides: Partial<Mining> = {}) => {
        const activity: Mining = {
            id: 'act-1',
            type: ActivityTypes.Mining,
            max: 1,
            remove: false,
            oreType: OreTypes.Copper,
            isMining: true,
            ...overrides,
        }
        ActivityAdapter.create(state.activities, activity)
        return activity
    }

    const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.Mining, actId: 'act-1' }

    it('throws when trying to end an activity that no longer exists', () => {
        expect(() => execMining(state, { ...timer, actId: 'missing' })).toThrow()
    })

    it('grants mining exp on every swing', () => {
        makeActivity()
        execMining(state, timer)

        expect(state.characters.entries['Player']!.skillsExp[ExpEnum.Mining]).toBeGreaterThan(0)
    })

    it('starts the initial ore node dig when not already mining', () => {
        makeActivity({ isMining: false })

        execMining(state, timer)

        const data = ActivityAdapter.selectEx(state.activities, 'act-1') as Mining
        expect(data.isMining).toBe(true)
        expect(state.timers.ids).toHaveLength(1)
    })

    it('fells the ore node and drops an ore item once hp is depleted', () => {
        makeActivity({ isMining: true })
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).ores[OreTypes.Copper] = {
            qta: 5,
            hp: 1,
        }

        execMining(state, timer)

        const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        expect(storage.entries['CopperOre']?.quantity).toBe(1)
        expect(state.activityDone).toBe(1)
    })

    it('returns NotPossible and removes the activity when the active vein no longer exists', () => {
        makeActivity({ activeVeinId: 'missing-vein', activeOreType: OreTypes.Copper })

        execMining(state, timer)

        expect(ActivityAdapter.select(state.activities, 'act-1')).toBeUndefined()
    })

    it('mines an ore vein and keeps mining it until it is completed', () => {
        makeActivity({ activeVeinId: 'vein-1', activeOreType: OreTypes.Copper })
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).oreVeins[OreTypes.Copper] = [
            { id: 'vein-1', oreType: OreTypes.Copper, qta: 2, maxQta: 2, hp: 1, maxHp: 50, armour: 0, gemChance: 0 },
        ]

        execMining(state, timer)

        const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        expect(storage.entries['CopperOre']?.quantity).toBe(1)
        expect(state.timers.ids).toHaveLength(1)
    })

    it('completes and removes the vein once the last charge is mined', () => {
        makeActivity({ activeVeinId: 'vein-1', activeOreType: OreTypes.Copper })
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).oreVeins[OreTypes.Copper] = [
            { id: 'vein-1', oreType: OreTypes.Copper, qta: 1, maxQta: 1, hp: 1, maxHp: 50, armour: 0, gemChance: 0 },
        ]

        execMining(state, timer)

        expect(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).oreVeins[OreTypes.Copper]
        ).toHaveLength(0)
        expect(state.activityDone).toBe(1)
    })
})
