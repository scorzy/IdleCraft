import { ActivityStartResult } from '../../activities/activityInterfaces'
import { ActivityAdapter } from '../../activities/ActivityState'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { ExpEnum } from '../../experience/expEnum'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { isMining } from '../Mining'
import { resetOre, mineOre } from '../miningFunctions'
import { selectMiningDamage } from '../selectors/miningDamage'
import { startMiningOre } from './startMiningOre'

export const execMining = makeExecActivity((state: GameState, timer: Timer) => {
    const data = ActivityAdapter.selectEx(state.activities, timer.actId)
    if (!isMining(data)) throw new Error('[makeExecActivity] Not a mining activity')
    const id = timer.actId
    let completed = false

    if (!data.isMining) {
        state = {
            ...state,
            mining: MiningAdapter.update(state.mining, id, { isMining: true }),
        }
        state = resetOre(state, data.oreType, state.location)
    } else {
        const damage = selectMiningDamage(state)
        state = addExp(state, ExpEnum.Mining, damage * 0.1)
        const res = mineOre(state, data.oreType, damage, state.location)
        state = res.state
        completed = res.mined
    }

    if (completed) {
        state = addItem(state, `${data.oreType}Ore`, 1)
    } else {
        state = startMiningOre(state, id)
    }

    return {
        state,
        result: completed ? ActivityStartResult.Ended : ActivityStartResult.Started,
    }
})
