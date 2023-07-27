import { GameState } from '../game/GameState'
import { ActivityAdapter } from './ActivityState'
import { removeActivityTimers } from '../timers/timerFunctions'

export enum ActivityStartResult {
    Started,
    NotPossible,
    Ended,
}
export interface StartResult {
    gameState: GameState
    result: ActivityStartResult
}

export abstract class AbstractActivity<T> {
    protected state: GameState
    protected id: string
    protected data: T

    constructor(state: GameState, id: string) {
        this.state = state
        this.id = id
        this.data = this.getData()
    }

    abstract getData(): T

    start(): StartResult {
        const res = this.onStart()
        if (res.result === ActivityStartResult.NotPossible) this.state = this.remove()
        this.state = { ...this.state, activityId: this.id }
        return {
            gameState: res.gameState,
            result: res.result,
        }
    }
    abstract onStart(): StartResult

    exec(): StartResult {
        const res = this.onExec()
        if (res.result === ActivityStartResult.NotPossible) {
            this.state = this.remove()
        } else if (res.result === ActivityStartResult.Ended) {
            this.state = {
                ...this.state,
                activityDone: this.state.activityDone + 1,
                activityId: this.id,
                lastActivityDone: this.state.orderedActivities.indexOf(this.id),
            }
        }
        return {
            gameState: res.gameState,
            result: res.result,
        }
    }
    abstract onExec(): StartResult

    remove(): GameState {
        this.state = this.onRemove()
        const activityId = this.id
        const lastActivityDone =
            this.state.lastActivityDone >= this.state.orderedActivities.indexOf(activityId)
                ? Math.max(0, this.state.lastActivityDone - 1)
                : this.state.lastActivityDone
        const activities = ActivityAdapter.remove(this.state.activities, activityId)
        this.state = {
            ...this.state,
            activities,
            lastActivityDone,
            activityId: activityId === this.state.activityId ? null : this.state.activityId,
            orderedActivities: this.state.orderedActivities.filter((id) => id !== activityId),
        }
        this.state = removeActivityTimers(this.state, activityId)

        return this.state
    }
    abstract onRemove(): GameState
}
