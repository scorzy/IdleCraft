import { ReactNode } from 'react'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { ActivityTypes } from '../activities/ActivityState'
import { AbstractActivityCreator } from '../activities/AbstractActivityCreator'
import { TimerTypes } from '../timers/Timer'
import { addItem } from '../storage/storageFunctions'
import { Translations } from '../msg/Msg'
import { addExp } from '../experience/expFunctions'
import { ExpEnum } from '../experience/expEnum'
import { startTimer } from '../timers/startTimer'
import { Woodcutting } from './Woodcutting'
import { WoodcuttingAdapter } from './WoodcuttingAdapter'
import { WoodTypes } from './WoodTypes'
import { selectWoodcuttingDamage, selectWoodcuttingTime } from './selectors/WoodcuttingSelectors'
import { hasTrees } from './forest/forestFunctions'
import { cutTree } from './forest/cutTree'
import { WoodData } from './WoodData'

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
        return WoodcuttingAdapter.selectEx(this.state.woodcutting, this.id)
    }

    onRemove() {
        this.state = { ...this.state, woodcutting: WoodcuttingAdapter.remove(this.state.woodcutting, this.id) }
    }
    onStart(): ActivityStartResult {
        if (!hasTrees(this.state, this.data.woodType)) {
            this.state = { ...this.state, waitingTrees: this.id }
            return ActivityStartResult.Started
        }

        this.state = { ...this.state, waitingTrees: null }
        const time = selectWoodcuttingTime(this.state)
        this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)

        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        if (!hasTrees(this.state, this.data.woodType)) return ActivityStartResult.NotPossible

        const damage = selectWoodcuttingDamage(this.state)
        const res = cutTree(this.state, this.data.woodType, damage, this.state.location)
        this.state = res.state
        this.state = addExp(this.state, ExpEnum.Woodcutting, damage * 0.1)
        if (res.cut) {
            this.state = addItem(this.state, `${this.data.woodType}Log`, null, 1)
        } else {
            const time = selectWoodcuttingTime(this.state)
            this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)
        }

        return res.cut ? ActivityStartResult.Ended : ActivityStartResult.Started
    }

    getTitleInt(t: Translations): string {
        return t.fun.cutting(this.data.woodType)
    }
    getIcon(): ReactNode {
        return WoodData[this.data.woodType].icon
    }
}
