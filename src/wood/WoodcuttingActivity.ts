import { AbstractActivity, StartResult, ActivityStartResult } from '../activities/AbstractActivity'
import { ActivityTypes } from '../activities/ActivityState'
import { GameState } from '../game/GameState'
import { Woodcutting } from './WoodInterfaces'
import { WoodcuttingAdapter } from './WoodcuttingAdapter'
import { WoodTypes } from './WoodTypes'
import { AbstractActivityCreator } from '../activities/AbstractActivityCreator'
import { startTimer } from '../timers/timerFunctions'
import { TimerTypes } from '../timers/Timer'
import { addItem } from '../storage/storageFunctions'
import { getWoodcuttingDamage, getWoodcuttingTime } from './WoodcuttingSelectors'
import { hasTrees, cutTree } from './forest/forestFunctions'

export class WoodcuttingActivityCreator extends AbstractActivityCreator<WoodTypes> {
    protected type = ActivityTypes.Woodcutting
    onAdd() {
        this.state = {
            ...this.state,
            woodcutting: WoodcuttingAdapter.create(this.state.woodcutting, {
                activityId: this.id,
                woodType: this.data,
            }),
        }
    }
}

export class WoodcuttingActivity extends AbstractActivity<Woodcutting> {
    getData(): Woodcutting {
        const ret = WoodcuttingAdapter.select(this.state.woodcutting, this.id)
        if (ret === undefined) throw new Error(`[getData] woodcutting not found ${this.id}`)
        return ret
    }

    onRemove(): GameState {
        this.state = { ...this.state, woodcutting: WoodcuttingAdapter.remove(this.state.woodcutting, this.id) }
        return this.state
    }
    onStart(): StartResult {
        if (!hasTrees(this.state, this.data.woodType))
            return {
                gameState: this.state,
                result: ActivityStartResult.NotPossible,
            }

        const time = getWoodcuttingTime()
        this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)

        return {
            gameState: this.state,
            result: ActivityStartResult.Started,
        }
    }
    onExec(): StartResult {
        if (!hasTrees(this.state, this.data.woodType))
            return {
                gameState: this.state,
                result: ActivityStartResult.NotPossible,
            }
        const damage = getWoodcuttingDamage()
        const res = cutTree(this.state, this.data.woodType, damage, this.state.location)
        this.state = res.state
        if (res.cut) {
            //  Add Item
            //  Add exp
            this.state = addItem(this.state, `${this.data.woodType}Log`, null, 1)
        } else {
            const time = getWoodcuttingTime()
            this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)
        }

        return {
            gameState: this.state,
            result: res.cut ? ActivityStartResult.Ended : ActivityStartResult.Started,
        }
    }
}
