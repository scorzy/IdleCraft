import { beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { initialize } from '../../game/functions/initialize'
import { GameState } from '../../game/GameState'
import { GetInitialGameState } from '../../game/InitialGameState'
import { GameLocations } from '../../gameLocations/GameLocations'
import { ExpEnum } from '../../experience/ExpEnum'
import { TimerAdapter } from '../../timers/Timer'
import { TreeGrowthAdapter } from '../forest/forestGrowth'
import { GrowSpeedBonus, GrowSpeedBonusAdapter } from '../forest/growSpeedBonus'
import { IncreaseGrowSpeed } from '../IncreaseGrowSpeed'
import { WoodTypes } from '../WoodTypes'
import { onGrowSpeedBonusEnd } from './onGrowSpeedBonusEnd'
import { execIncreaseGrowSpeed } from './execIncreaseGrowSpeed'

describe('grow-speed activity execution', () => {
    let state: GameState
    const timer = { id: 'activity-timer', from: 0, to: 0, type: ActivityTypes.IncreaseGrowSpeed, actId: 'boost' }

    beforeAll(() => initialize())

    beforeEach(() => {
        state = GetInitialGameState()
        state.isTimer = true
        state.now = 0
    })

    function addActivity() {
        const activity: IncreaseGrowSpeed = {
            id: 'boost',
            type: ActivityTypes.IncreaseGrowSpeed,
            max: 1,
            remove: false,
            woodType: WoodTypes.DeadTree,
            location: GameLocations.StartVillage,
        }
        ActivityAdapter.create(state.activities, activity)
        return activity
    }

    function addBonus(id: string, end: number, woodType = WoodTypes.DeadTree, location = GameLocations.StartVillage) {
        const bonus: GrowSpeedBonus = { id, woodType, location, multi: -10 }
        GrowSpeedBonusAdapter.create(state.growSpeedBonuses, bonus)
        TimerAdapter.create(state.timers, {
            id,
            from: 0,
            to: end,
            type: ActivityTypes.GrowSpeedBonus,
            actId: id,
        })
    }

    it('creates a bonus, schedules its expiry, scales matching growth timers, and grants XP', () => {
        addActivity()
        TreeGrowthAdapter.create(state.treeGrowth, {
            id: 'growth',
            woodType: WoodTypes.DeadTree,
            location: GameLocations.StartVillage,
        })
        TimerAdapter.create(state.timers, {
            id: 'growth-timer',
            from: 0,
            to: 180_000,
            type: ActivityTypes.Tree,
            actId: 'growth',
        })

        execIncreaseGrowSpeed(state, timer)

        expect(GrowSpeedBonusAdapter.count(state.growSpeedBonuses, () => true)).toBe(1)
        const bonusId = state.growSpeedBonuses.ids[0]!
        expect(TimerAdapter.select(state.timers, bonusId)).toMatchObject({
            type: ActivityTypes.GrowSpeedBonus,
            actId: bonusId,
            to: 120_000,
        })
        expect(TimerAdapter.selectEx(state.timers, 'growth-timer').to).not.toBe(180_000)
        expect(state.characters.entries.Player!.skillsExp[ExpEnum.Woodcutting]).toBe(10)
        expect(state.activityDone).toBe(1)
    })

    it('replaces the earliest expiring bonus when the cap is reached', () => {
        addActivity()
        addBonus('oldest', 100)
        addBonus('middle', 200)
        addBonus('latest', 300)

        execIncreaseGrowSpeed(state, timer)

        expect(GrowSpeedBonusAdapter.select(state.growSpeedBonuses, 'oldest')).toBeUndefined()
        expect(TimerAdapter.select(state.timers, 'oldest')).toBeUndefined()
        expect(GrowSpeedBonusAdapter.count(state.growSpeedBonuses, () => true)).toBe(3)
        expect(state.growSpeedBonuses.ids).toContain('middle')
        expect(state.growSpeedBonuses.ids).toContain('latest')
    })

    it('removes an expired bonus and updates only its matching growth timers', () => {
        addBonus('bonus', 1_000)
        TreeGrowthAdapter.create(state.treeGrowth, {
            id: 'growth',
            woodType: WoodTypes.DeadTree,
            location: GameLocations.StartVillage,
        })
        TimerAdapter.create(state.timers, {
            id: 'growth-timer',
            from: 0,
            to: 162_000,
            type: ActivityTypes.Tree,
            actId: 'growth',
        })
        TimerAdapter.create(state.timers, {
            id: 'unrelated',
            from: 0,
            to: 5_000,
            type: ActivityTypes.Crafting,
            actId: 'other',
        })

        onGrowSpeedBonusEnd(state, TimerAdapter.selectEx(state.timers, 'bonus'))

        expect(GrowSpeedBonusAdapter.select(state.growSpeedBonuses, 'bonus')).toBeUndefined()
        expect(TimerAdapter.selectEx(state.timers, 'growth-timer').to).not.toBe(162_000)
        expect(TimerAdapter.selectEx(state.timers, 'unrelated').to).toBe(5_000)
    })

    it('throws when the timer points to a missing activity', () => {
        expect(() => execIncreaseGrowSpeed(state, timer)).toThrow()
    })
})
