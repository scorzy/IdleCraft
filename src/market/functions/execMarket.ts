import { ActivityAdapter } from '../../activities/ActivityState'
import { ActivityStartResult } from '../../activities/activityInterfaces'
import { makeExecActivity } from '../../activities/functions/makeExecActivity'
import { ExpEnum } from '../../experience/ExpEnum'
import { addExp } from '../../experience/expFunctions'
import { GameState } from '../../game/GameState'
import { addGold, hasItem, removeItem } from '../../storage/storageFunctions'
import { Timer } from '../../timers/Timer'
import { isMarket } from '../Market'
import { PERSUASION_EXP_PER_GOLD } from '../MarketConst'
import { selectSaleValue } from '../selectors/saleValue'

export const execMarket = makeExecActivity((state: GameState, timer: Timer) => {
    const id = timer.actId
    if (!id) throw new Error(`[execMarket] data not found ${JSON.stringify(timer)}`)

    const data = ActivityAdapter.select(state.activities, id)
    if (!data) {
        console.error(`[execMarket] data not found ${id}`)
        return ActivityStartResult.NotPossible
    }

    if (!isMarket(data)) throw new Error(`[execMarket] wrong type ${data.type}`)

    if (!hasItem(state, data.itemId, 1)) return ActivityStartResult.NotPossible

    const saleValue = selectSaleValue(data.itemId)(state)

    removeItem(state, data.itemId, 1)
    addGold(state, saleValue)
    addExp(state, ExpEnum.Persuasion, Math.max(1, Math.round(saleValue * PERSUASION_EXP_PER_GOLD)))

    return ActivityStartResult.Ended
})
