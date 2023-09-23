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
import { hasOre, mineOre, resetOre } from './miningFunctions'
import { getMiningTime, getMiningDamage, getSearchMineTime } from './miningSelectors'
import { addExp } from '../experience/expFunctions'
import { ExpEnum } from '../experience/expEnum'

export class MiningActivityCreator extends AbstractActivityCreator<OreTypes> {
    protected type = ActivityTypes.Mining
    onAdd() {
        this.state = {
            ...this.state,
            mining: MiningAdapter.create(this.state.mining, {
                activityId: this.id,
                oreType: this.data,
                isMining: true,
            }),
        }
    }
}

export class MiningActivity extends AbstractActivity<Mining> {
    private StartMining() {
        const time = getMiningTime()
        this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)
        if (!this.data.isMining)
            this.state = {
                ...this.state,
                mining: MiningAdapter.update(this.state.mining, this.id, { isMining: true }),
            }
    }
    getData(): Mining {
        return MiningAdapter.selectEx(this.state.mining, this.id)
    }
    onRemove() {
        this.state = { ...this.state, mining: MiningAdapter.remove(this.state.mining, this.id) }
    }
    onStart(): ActivityStartResult {
        if (!hasOre(this.state, this.data.oreType)) {
            const time = getSearchMineTime()
            this.state = startTimer(this.state, time, TimerTypes.Activity, this.id)
            if (this.data.isMining)
                this.state = {
                    ...this.state,
                    mining: MiningAdapter.update(this.state.mining, this.id, { isMining: false }),
                }
        } else {
            this.StartMining()
        }
        return ActivityStartResult.Started
    }
    onExec(): ActivityStartResult {
        let completed = false
        if (!this.data.isMining) {
            this.state = {
                ...this.state,
                mining: MiningAdapter.update(this.state.mining, this.id, { isMining: true }),
            }
            this.state = resetOre(this.state, this.data.oreType, this.state.location)
        } else {
            const damage = getMiningDamage()
            this.state = addExp(this.state, ExpEnum.Mining, damage * 0.1)
            const res = mineOre(this.state, this.data.oreType, damage, this.state.location)
            this.state = res.state
            completed = res.mined
        }

        if (completed) {
            this.state = addItem(this.state, `${this.data.oreType}Ore`, null, 1)
        } else {
            this.StartMining()
        }

        return completed ? ActivityStartResult.Ended : ActivityStartResult.Started
    }
    getTitleInt(t: Translations): string {
        return t.fun.mining(OreData[this.data.oreType].nameId)
    }
    getIcon(): ReactNode {
        return OreData[this.data.oreType].icon
    }
}
