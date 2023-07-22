import { AbstractActivity, StartResult, ActivityStartResult } from '../activities/AbstractActivity'
import { ActivityTypes } from '../activities/ActivityState'

import { GameState } from '../game/GameState'
import { Woodcutting } from './WoodInterfaces'
import { WoodcuttingAdapter } from './WoodcuttingAdapter'
import { cutTree, hasTrees } from './forestFunctions'
import { WoodTypes } from './WoodTypes'
import { AbstractActivityCreator } from '../activities/AbstractActivity'
import { startTimer } from '../timers/timerFunctions'
import { TimerTypes } from '../timers/Timer'
import { addItem } from '../storage/storageFunctions'

export class WoodcuttingActivityCreator extends AbstractActivityCreator {
    type = ActivityTypes.Woodcutting
    create(woodType: WoodTypes): GameState {
        this.state = this.create(woodType)
        this.state = {
            ...this.state,
            woodcutting: WoodcuttingAdapter.create(this.state.woodcutting, {
                activityId: this.id,
                woodType,
            }),
        }
        return this.state
    }
}

export class WoodcuttingActivity extends AbstractActivity<Woodcutting> {
    getData(): Woodcutting {
        return WoodcuttingAdapter.select(this.state.woodcutting, this.id)
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

        const time = 2e3
        this.state = startTimer(this.state, time, TimerTypes.Woodcutting, this.id)

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
        const damage = 25
        const res = cutTree(this.state, this.data.woodType, damage, this.state.location)
        this.state = res.state
        if (res.cut) {
            //  Add Item
            //  Add exp
            this.state = addItem(this.state, '', null, 1)
        }

        return {
            gameState: this.state,
            result: res.cut ? ActivityStartResult.Ended : ActivityStartResult.Started,
        }
    }
}
