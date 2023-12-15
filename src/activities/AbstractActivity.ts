import { ReactNode } from 'react'
import { GameState } from '../game/GameState'
import { Translations } from '../msg/Msg'
import { selectTranslations } from '../msg/useTranslations'
import { ActivityAdapter } from './ActivityState'
import { removeActivityTimers } from '@/timers/removeActivityTimers'

export enum ActivityStartResult {
    Started,
    NotPossible,
    Ended,
}
interface StartResult {
    gameState: GameState
    result: ActivityStartResult
}
export interface Activity<T> {
    getData(): T
    start(): StartResult
    onStart(): ActivityStartResult
    exec(): StartResult
    remove(): GameState
    getTitle(): string
    getIcon(): ReactNode
}
export abstract class AbstractActivity<T> implements Activity<T> {
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
        const result = this.onStart()
        if (result === ActivityStartResult.NotPossible) this.state = this.remove()
        this.state = { ...this.state, activityId: this.id }
        return {
            gameState: this.state,
            result,
        }
    }
    abstract onStart(): ActivityStartResult

    exec(): StartResult {
        const result = this.onExec()
        if (result === ActivityStartResult.NotPossible) {
            this.state = this.remove()
        } else if (result === ActivityStartResult.Ended) {
            this.state = {
                ...this.state,
                activityDone: this.state.activityDone + 1,
                activityId: this.id,
                lastActivityDone: this.state.orderedActivities.indexOf(this.id),
            }
        }
        return {
            gameState: this.state,
            result,
        }
    }
    abstract onExec(): ActivityStartResult

    remove(): GameState {
        this.onRemove()
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
    abstract onRemove(): void
    getTitle(): string {
        const t = selectTranslations(this.state)
        return this.getTitleInt(t)
    }

    protected abstract getTitleInt(t: Translations): string
    abstract getIcon(): ReactNode
}
