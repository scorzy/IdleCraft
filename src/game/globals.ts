import { ReactNode } from 'react'
import { ActivityTypes } from '../activities/ActivityState'
import { Timer } from '../timers/Timer'
import { ActivityStartResult } from '../activities/activityInterfaces'
import { MapEx } from '../utils/MapEx'
import { GameState } from './GameState'

export const activityExecutors: MapEx<ActivityTypes, (state: GameState, timer: Timer) => GameState> = new MapEx()
export const activityRemovers: MapEx<ActivityTypes, (state: GameState, activityId: string) => GameState> = new MapEx()
export const activityStarters: MapEx<
    ActivityTypes,
    (state: GameState, activityId: string) => { state: GameState; result: ActivityStartResult }
> = new MapEx()
export const activityTitles: MapEx<ActivityTypes, (state: GameState, activityId: string) => string> = new MapEx()
export const activityIcons: MapEx<ActivityTypes, (state: GameState, activityId: string) => ReactNode> = new MapEx()
