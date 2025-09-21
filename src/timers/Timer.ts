import { ActivityTypes } from '../activities/ActivityState'
import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'
import { InitialState } from '@/entityAdapter/InitialState'

export interface Timer {
    id: string
    from: number
    to: number
    type: ActivityTypes
    actId: string
}

export type InitialTimerState = InitialState<Timer>

class TimerAdapterInt extends AbstractEntityAdapter<Timer> {
    getId(data: Timer): string {
        return data.id
    }
}
export const TimerAdapter = new TimerAdapterInt()
