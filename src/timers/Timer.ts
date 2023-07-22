import { AbstractEntityAdapter } from '../entityAdapter/entityAdapter'

export enum TimerTypes {
    Woodcutting = 'Woodcutting',
}

export interface Timer {
    id: string
    from: number
    to: number
    intervalId: number
    type: TimerTypes
    actId?: string
    data?: unknown
}
class TimerAdapterInt extends AbstractEntityAdapter<Timer> {
    getId(data: Timer): string {
        return data.id
    }
    sort = (a: Timer, b: Timer) => a.to - b.to
}
export const TimerAdapter = new TimerAdapterInt()
