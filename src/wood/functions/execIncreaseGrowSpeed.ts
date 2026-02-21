import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { GameState } from '../../game/GameState'
import { startTimer } from '../../timers/startTimer'
import { Timer, TimerAdapter } from '../../timers/Timer'
import { getUniqueId } from '../../utils/getUniqueId'
import { GrowSpeedBonus, GrowSpeedBonusAdapter } from '../forest/growSpeedBonus'
import { scaleTreeGrowthTimers } from '../../timers/scaleTimers'
import { isIncreaseGrowSpeed } from '../IncreaseGrowSpeed'
import {
    selectFirstExpiringGrowSpeedTimer,
    selectGrowSpeedBonusMultiplier,
    selectIncreaseGrowSpeedActiveCount,
    selectIncreaseGrowSpeedCap,
    selectIncreaseGrowSpeedDuration,
    selectIncreaseGrowSpeedMulti,
} from '../forest/growSpeedSelectors'
import { onGrowSpeedBonusEnd } from './onGrowSpeedBonusEnd'

export const execIncreaseGrowSpeed = makeExecActivity((state: GameState, timer: Timer) => {
    const act = ActivityAdapter.select(state.activities, timer.actId)
    if (!act || !isIncreaseGrowSpeed(act)) return ActivityStartResult.NotPossible

    const active = selectIncreaseGrowSpeedActiveCount(state, act.woodType, act.location)

    if (active >= selectIncreaseGrowSpeedCap(state)) {
        const timerToRemove: Timer | undefined = selectFirstExpiringGrowSpeedTimer(state, act.woodType, act.location)

        if (timerToRemove !== undefined) {
            TimerAdapter.remove(state.timers, timerToRemove.id)
            onGrowSpeedBonusEnd(state, timerToRemove)
        }
    }

    const before = selectGrowSpeedBonusMultiplier(state, act.woodType, act.location)
    const bonus: GrowSpeedBonus = {
        id: getUniqueId(),
        location: act.location,
        woodType: act.woodType,
        multi: selectIncreaseGrowSpeedMulti(state),
    }

    GrowSpeedBonusAdapter.create(state.growSpeedBonuses, bonus)
    const after = selectGrowSpeedBonusMultiplier(state, act.woodType, act.location)

    scaleTreeGrowthTimers(state, act.woodType, act.location, after / before)

    const duration = selectIncreaseGrowSpeedDuration(state)
    startTimer(state, duration, ActivityTypes.GrowSpeedBonus, bonus.id, bonus.id)

    return ActivityStartResult.Ended
})
