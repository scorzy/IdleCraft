import { GameState } from '../game/GameState'
import { Activity } from './AbstractActivity'
import { ActivityTypes } from './ActivityState'

export const activities = new Map<ActivityTypes, (state: GameState, id: string) => Activity<unknown>>()

export function makeActivityFun(state: GameState, type: ActivityTypes, id: string): Activity<unknown> {
    const act = activities.get(type)
    if (!act) throw new Error(`Activity with type ${type} not found`)
    return act(state, id)
}
