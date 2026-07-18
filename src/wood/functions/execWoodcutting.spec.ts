import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { ExpEnum } from '../../experience/ExpEnum'
import { Timer } from '../../timers/Timer'
import { Woodcutting } from '../Woodcutting'
import { WoodTypes } from '../WoodTypes'
import { execWoodcutting } from './execWoodcutting'

describe('execWoodcutting', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
        state.location = GameLocations.StartVillage
        const activity: Woodcutting = {
            id: 'act-1',
            type: ActivityTypes.Woodcutting,
            max: 1,
            remove: false,
            woodType: WoodTypes.DeadTree,
        }
        ActivityAdapter.create(state.activities, activity)
    })

    const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.Woodcutting, actId: 'act-1' }

    it('removes the activity when there are no trees left to cut', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree] = {
            qta: 0,
            hp: 100,
        }

        execWoodcutting(state, timer)

        expect(ActivityAdapter.select(state.activities, 'act-1')).toBeUndefined()
    })

    it('schedules another swing and grants exp when the tree is not yet felled', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree] = {
            qta: 5,
            hp: 1000,
        }

        execWoodcutting(state, timer)

        expect(state.timers.ids).toHaveLength(1)
        expect(state.characters.entries['Player']!.skillsExp[ExpEnum.Woodcutting]).toBeGreaterThan(0)
        expect(
            GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree]!.hp
        ).toBeLessThan(1000)
    })

    it('fells the tree, drops a log, and ends the activity', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).forests[WoodTypes.DeadTree] = {
            qta: 5,
            hp: 1,
        }

        execWoodcutting(state, timer)

        const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        expect(storage.entries['DeadTreeLog']?.quantity).toBe(1)
        expect(state.activityDone).toBe(1)
    })
})
