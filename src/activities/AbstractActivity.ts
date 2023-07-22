import { GameState } from '../game/GameState'
import { getUniqueId } from '../utils/getUniqueId'
import { ActivityAdapter, ActivityState, ActivityTypes } from './ActivityState'

export enum ActivityStartResult {
    Started,
    NotPossible,
    Ended,
}
export interface StartResult {
    gameState: GameState
    result: ActivityStartResult
}

export abstract class AbstractActivityCreator {
    abstract type: ActivityTypes
    protected id: string
    constructor(protected state: GameState) {
        this.id = getUniqueId()
    }
    protected createActivity(): GameState {
        const activity: ActivityState = {
            id: this.id,
            type: this.type,
            max: 1,
        }
        this.state = { ...this.state, activities: ActivityAdapter.create(this.state.activities, activity) }

        return this.state
    }
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
        return {
            gameState: res.gameState,
            result: res.result,
        }
    }
    abstract onStart(): StartResult

    exec(): StartResult {
        const res = this.onExec()
        return {
            gameState: res.gameState,
            result: res.result,
        }
    }
    abstract onExec(): StartResult
}
