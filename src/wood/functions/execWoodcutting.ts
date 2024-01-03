import { ActivityTypes } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { ExpEnum } from '../../experience/expEnum'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { startTimer } from '../../timers/startTimer'
import { WoodcuttingAdapter } from '../WoodcuttingAdapter'
import { cutTree } from '../forest/cutTree'
import { hasTrees } from '../forest/forestFunctions'
import { selectWoodcuttingDamage, selectWoodcuttingTime } from '../selectors/WoodcuttingSelectors'

export const execWoodcutting = makeExecActivity((state: GameState, timer: Timer) => {
    const id = timer.actId
    if (!id) throw new Error(`[onWoodcuttingExec] data not found ${JSON.stringify(timer)}`)
    const data = WoodcuttingAdapter.selectEx(state.woodcutting, id)
    if (!hasTrees(state, data.woodType)) return { state, result: ActivityStartResult.NotPossible }

    const damage = selectWoodcuttingDamage(state)
    const res = cutTree(state, data.woodType, damage, state.location)
    state = res.state
    state = addExp(state, ExpEnum.Woodcutting, damage * 0.1)
    if (res.cut) {
        state = addItem(state, `${data.woodType}Log`, null, 1)
    } else {
        const time = selectWoodcuttingTime(state)
        state = startTimer(state, time, ActivityTypes.Woodcutting, id)
    }

    const result = res.cut ? ActivityStartResult.Ended : ActivityStartResult.Started

    return { state, result }
})
