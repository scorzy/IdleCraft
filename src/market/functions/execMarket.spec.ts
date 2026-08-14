import { beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { PLAYER_ID } from '../../characters/charactersConst'
import { ExpEnum } from '../../experience/ExpEnum'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocationAdapter } from '../../gameLocations/GameLocationAdapter'
import { GameLocations } from '../../gameLocations/GameLocations'
import { Timer } from '../../timers/Timer'
import { Market } from '../Market'
import { execMarket } from './execMarket'

describe('execMarket', () => {
    let state: GameState

    beforeEach(() => {
        initialize()
        state = GetInitialGameState()
        state.location = GameLocations.StartVillage
        const activity: Market = {
            id: 'act-1',
            type: ActivityTypes.Market,
            max: 1,
            remove: false,
            itemId: 'OakLog',
        }
        ActivityAdapter.create(state.activities, activity)
    })

    const timer: Timer = { id: 't1', from: 0, to: 0, type: ActivityTypes.Market, actId: 'act-1' }

    it('sells 1 unit of the item, grants gold and Persuasion exp, and ends the activity', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage = {
            ids: ['OakLog'],
            entries: { OakLog: { itemId: 'OakLog', quantity: 5 } },
        }

        execMarket(state, timer)

        const storage = GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage
        expect(storage.entries['OakLog']?.quantity).toBe(4)
        expect(state.gold).toBeGreaterThan(0)
        expect(state.characters.entries[PLAYER_ID]!.skillsExp[ExpEnum.Persuasion]).toBeGreaterThan(0)
        expect(state.activityDone).toBe(1)
    })

    it('removes the activity when there is no stock left to sell', () => {
        GameLocationAdapter.selectEx(state.locations, GameLocations.StartVillage).storage = {
            ids: [],
            entries: {},
        }

        execMarket(state, timer)

        expect(ActivityAdapter.select(state.activities, 'act-1')).toBeUndefined()
        expect(state.gold).toBe(0)
    })
})
