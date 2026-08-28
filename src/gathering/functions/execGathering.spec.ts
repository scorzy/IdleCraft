import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { ExpEnum } from '../../experience/ExpEnum'
import { selectItemQta } from '../../storage/StorageSelectors'
import { Timer } from '../../timers/Timer'
import { Gathering } from '../Gathering'
import { GatheringZone } from '../gatheringZones'
import { execGathering } from './execGathering'

describe('execGathering', () => {
    let state: GameState
    const timer: Timer = { id: 'timer', from: 0, to: 0, type: ActivityTypes.Gathering, actId: 'gathering' }

    beforeAll(() => initialize())

    beforeEach(() => {
        state = GetInitialGameState()
        vi.spyOn(Math, 'random').mockReturnValue(0)
    })

    afterEach(() => vi.restoreAllMocks())

    function addGathering(overrides: Partial<Gathering> = {}) {
        ActivityAdapter.create(state.activities, {
            id: 'gathering',
            type: ActivityTypes.Gathering,
            zone: GatheringZone.Forest,
            max: 1,
            remove: false,
            ...overrides,
        })
    }

    it('adds the guaranteed and bonus drops, awards gathering XP, and ends the activity', () => {
        addGathering()

        execGathering(state, timer)

        expect(selectItemQta(null, 'RedFlower')(state)).toBe(2)
        expect(state.characters.entries.Player!.skillsExp[ExpEnum.Gathering]).toBe(10)
        expect(state.activityDone).toBe(1)
    })

    it('throws when its activity record has disappeared', () => {
        expect(() => execGathering(state, timer)).toThrow()
    })

    it('throws for a timer with no activity id or a non-gathering activity', () => {
        expect(() => execGathering(state, { ...timer, actId: '' })).toThrow('[execGathering] Missing activity id')

        ActivityAdapter.create(state.activities, {
            id: 'gathering',
            type: ActivityTypes.Crafting,
            max: 1,
        })
        expect(() => execGathering(state, timer)).toThrow('[execGathering] Activity is not gathering')
    })
})
