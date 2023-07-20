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

export abstract class AbstractActivity<T> {
    private id: string | undefined

    constructor(id?: string) {
        this.id = id
    }

    add(state: GameState, type: ActivityTypes, params: T): GameState {
        this.id = getUniqueId()
        const activity: ActivityState = {
            id: this.id,
            type,
            max: 1,
        }
        state = { ...state, activities: ActivityAdapter.create(state.activities, activity) }

        return this.onAdd(state, params)
    }
    abstract onAdd(state: GameState, params: T): GameState

    remove(state: GameState): GameState {
        if (this.id === undefined) throw new Error('activity id undefined')

        state = { ...state, activities: ActivityAdapter.remove(state.activities, this.id) }
        return this.onRemove(state)
    }
    abstract onRemove(state: GameState): GameState

    start(state: GameState): StartResult {
        if (this.id === undefined) throw new Error('activity id undefined')

        const res = this.onStart(state)
        return {
            gameState: res.gameState,
            result: res.result,
        }
    }
    abstract onStart(state: GameState): StartResult

    exec(state: GameState): StartResult {
        if (this.id === undefined) throw new Error('activity id undefined')

        const res = this.onExec(state)
        return {
            gameState: res.gameState,
            result: res.result,
        }
    }
    abstract onExec(state: GameState): StartResult
}
