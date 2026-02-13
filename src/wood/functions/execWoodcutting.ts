import { ActivityAdapter, ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { startTimer } from '../../timers/startTimer'
import { isWoodcutting } from '../Woodcutting'
import { cutTree } from '../forest/cutTree'
import { hasTrees } from '../forest/forestFunctions'
import { selectWoodcuttingDamage } from '../selectors/woodcuttingDamage'
import { selectWoodcuttingTime } from '../selectors/woodcuttingTime'
import { ExpEnum } from '@/experience/ExpEnum'

export const execWoodcutting = makeExecActivity((state: GameState, timer: Timer) => {
    const id = timer.actId
    if (!id) throw new Error(`[onWoodcuttingExec] data not found ${JSON.stringify(timer)}`)

    const data = ActivityAdapter.select(state.activities, id)
    if (!data) {
        console.error(`[onWoodcuttingExec] data not found ${id}`)
        return ActivityStartResult.NotPossible
    }

    if (!isWoodcutting(data)) throw new Error(`[onWoodcuttingExec] wrong type ${data.type}`)

    if (!hasTrees(state, data.woodType)) return ActivityStartResult.NotPossible

    const damage = selectWoodcuttingDamage(state)
    const res = cutTree(state, data.woodType, damage, state.location)

    addExp(state, ExpEnum.Woodcutting, damage * 0.1)
    if (res.cut) {
        addItem(state, `${data.woodType}Log`, 1)
    } else {
        const time = selectWoodcuttingTime(state)
        startTimer(state, time, ActivityTypes.Woodcutting, id)
    }

    return res.cut ? ActivityStartResult.Ended : ActivityStartResult.Started
})
