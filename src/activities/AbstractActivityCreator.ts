import { GameState } from '../game/GameState'
import { getUniqueId } from '../utils/getUniqueId'
import { ActivityAdapter, ActivityState, ActivityTypes } from './ActivityState'
import { makeActivityFun } from './makeActivityFun'

export abstract class AbstractActivityCreator<T> {
    protected abstract type: ActivityTypes
    protected id: string

    constructor(
        protected state: GameState,
        protected data: T
    ) {
        this.id = getUniqueId()
    }
    createActivity(): GameState {
        const activity: ActivityState = {
            id: this.id,
            type: this.type,
            max: 1,
        }
        this.state = {
            ...this.state,
            activities: ActivityAdapter.create(this.state.activities, activity),
            orderedActivities: [...this.state.orderedActivities, this.id],
        }

        this.onAdd()

        if (this.state.orderedActivities.length === 1) {
            const { gameState } = makeActivityFun(this.state, this.type, this.id).start()
            this.state = gameState
        }

        return this.state
    }

    protected abstract onAdd(): void
}
