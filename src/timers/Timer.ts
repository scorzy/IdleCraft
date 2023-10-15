import { AbstractEntityAdapter, InitialState } from '../entityAdapter/entityAdapter'

export enum TimerTypes {
    Activity = 'Activity',
    Tree = 'Tree',
}

export interface Timer {
    id: string
    from: number
    to: number
    intervalId?: number
    type: TimerTypes
    actId?: string
    data?: unknown
}

export interface InitialTimerState extends InitialState<Timer> {
    minId: string | undefined
}

class TimerAdapterInt extends AbstractEntityAdapter<Timer> {
    getId(data: Timer): string {
        return data.id
    }
    getInitialState(): InitialTimerState {
        return {
            minId: undefined,
            ids: [],
            entries: {},
        }
    }
    checkMin(state: InitialState<Timer>, lastMinId: string | undefined, data: Timer): InitialTimerState {
        let minId = data.id
        if (lastMinId) {
            const lastMin = state.entries[lastMinId]
            if (lastMin && lastMin.to > data.to) minId = lastMinId
        }

        return { ...state, minId }
    }
    completeState(state: InitialState<Timer>): InitialTimerState {
        if (state.ids.length === 0) return this.getInitialState()
        const id = state.ids[0]
        let minTimer: Timer = state.entries[id]
        for (const timId of state.ids) {
            const tim = state.entries[timId]
            if (tim && tim.to < minTimer.to) minTimer = tim
        }

        return { ...state, minId: minTimer.id }
    }

    create(state: InitialTimerState, data: Timer): InitialTimerState {
        const ret = super.create(state, data)
        return this.checkMin(ret, state.minId, data)
    }
    update(state: InitialTimerState, id: string, data: Partial<Timer>) {
        const ret = super.update(state, id, data)
        return this.checkMin(ret, state.minId, ret.entries[id])
    }
    replace(state: InitialTimerState, id: string, data: Timer) {
        const ret = super.replace(state, id, data)
        return this.checkMin(ret, state.minId, ret.entries[id])
    }
    upsertMerge(state: InitialTimerState, data: Timer) {
        const ret = super.upsertMerge(state, data)
        return this.checkMin(ret, state.minId, data)
    }

    remove(state: InitialTimerState, id: string) {
        const ret = super.remove(state, id)
        if (state.minId !== id) return { ...ret, minId: state.minId }
        if (ret.ids.length < 1) return { ...ret, minId: undefined }

        return this.completeState(ret)
    }
    load(data: unknown): InitialTimerState {
        if (!data) return this.getInitialState()
        if (typeof data !== 'object') return this.getInitialState()
        if (!('ids' in data)) return this.getInitialState()
        const ret = super.load(data)
        return this.completeState(ret)
    }
}
export const TimerAdapter = new TimerAdapterInt()
