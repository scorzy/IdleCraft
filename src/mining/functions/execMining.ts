import { ActivityStartResult } from '../../activities/activityInterfaces'
import { ActivityAdapter } from '../../activities/ActivityState'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { ExpEnum } from '../../experience/ExpEnum'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addItem } from '../../storage/storageFunctions'
import { getRandomNum } from '../../utils/getRandomNum'
import { Timer } from '../../timers/Timer'
import { isMining } from '../Mining'
import { mineOre, mineOreVein, resetOre } from '../miningFunctions'
import { selectMiningDamage } from '../selectors/miningDamage'
import { startMiningOre } from './startMiningOre'

const GEMS = ['Ruby', 'Sapphire', 'Emerald'] as const

export const execMining = makeExecActivity((state: GameState, timer: Timer) => {
    const data = ActivityAdapter.select(state.activities, timer.actId)

    if (!data) {
        console.error(`[execMining] data not found ${timer.actId}`)
        return ActivityStartResult.NotPossible
    }

    if (!isMining(data)) throw new Error('[makeExecActivity] Not a mining activity')
    const id = timer.actId
    const damage = selectMiningDamage(state)
    addExp(state, ExpEnum.Mining, damage * 0.1)

    if (data.activeVeinId) {
        const veinRes = mineOreVein(state, state.location, data.oreType, data.activeVeinId, damage)

        if (!veinRes.oreType) return ActivityStartResult.NotPossible
        if (veinRes.mined) {
            addItem(state, `${veinRes.oreType}Ore`, 1)
            if (veinRes.gemDropped) {
                const gem = GEMS[getRandomNum(0, GEMS.length - 1)]
                if (gem) addItem(state, gem, 1)
            }
        }

        if (!veinRes.completed) {
            startMiningOre(state, id)
            return ActivityStartResult.Started
        }

        return ActivityStartResult.Ended
    }

    if (!data.isMining) {
        resetOre(state, data.oreType, state.location)
        data.isMining = true
        startMiningOre(state, id)
        return ActivityStartResult.Started
    }

    const res = mineOre(state, data.oreType, damage, state.location)

    if (res.mined) {
        addItem(state, `${data.oreType}Ore`, 1)
        return ActivityStartResult.Ended
    }

    startMiningOre(state, id)
    return ActivityStartResult.Started
})
