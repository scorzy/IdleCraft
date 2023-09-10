import { ReactNode } from 'react'
import { AbstractActivity, ActivityStartResult } from '../activities/AbstractActivity'
import { AbstractActivityCreator } from '../activities/AbstractActivityCreator'
import { ActivityTypes } from '../activities/ActivityState'
import { Translations } from '../msg/Msg'
import { addItem } from '../storage/storageFunctions'
import { TimerTypes } from '../timers/Timer'
import { startTimer } from '../timers/startTimer'
import { Mining } from './Mining'
import { MiningAdapter } from './MiningAdapter'
import { OreTypes } from './OreTypes'
import { OreData } from './OreData'
import { hasOre, mineOre } from './miningFunctions'
import { getMiningTime, getMiningDamage } from './miningSelectors'

export class MiningActivityCreator extends AbstractActivityCreator<OreTypes> {
    protected type = ActivityTypes.Woodcutting
    onAdd() {
        this.state = {
            ...this.state,
            mining: MiningAdapter.create(this.state.mining, {
                activityId: this.id,
                oreType: this.data,
            }),
        }
    }
}

export class MiningActivity extends AbstractActivity<Mining> {
    getData(): Mining {
        return MiningAdapter.selectEx(this.state.mining, this.id)
    }
    onRemove() {
        this.state = { ...this.state, mining: MiningAdapter.remove(this.state.mining, this.id) }
    }
    onStart(): ActivityStartResult {
        if (!hasOre(this.state, this.data.oreType)) {
            // ToDo
            return ActivityStartResult.Started
        }

        this.state = { ...this.state, waitingTrees: null }
        const time = getMiningTime()
        this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)

        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        if (!hasOre(this.state, this.data.oreType)) return ActivityStartResult.NotPossible

        const damage = getMiningDamage()
        const res = mineOre(this.state, this.data.oreType, damage, this.state.location)
        this.state = res.state
        if (res.mined) {
            //  Add Item
            //  Add exp
            this.state = addItem(this.state, `${this.data.oreType}Ore`, null, 1)
        } else {
            const time = getMiningTime()
            this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)
        }

        return res.mined ? ActivityStartResult.Ended : ActivityStartResult.Started
    }
    getTitleInt(t: Translations): string {
        return t.fun.cutting(OreData[this.data.oreType].nameId)
    }
    getIcon(): ReactNode {
        return OreData[this.data.oreType].icon
    }
}
