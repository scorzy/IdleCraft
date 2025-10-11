import { ReactNode } from 'react'
import { ActivityState, ActivityTypes } from '../activities/ActivityState'
import { Timer } from '../timers/Timer'
import { ActivityStartResult } from '../activities/activityInterfaces'
import { MapEx } from '../utils/MapEx'
import { Icons } from '../icons/Icons'
import { GameState } from './GameState'

export const activityExecutors = new MapEx<ActivityTypes, (state: GameState, timer: Timer) => void>()
export const activityRemovers = new MapEx<ActivityTypes, (state: GameState, activityId: string) => void>()
export const activityStarters = new MapEx<
    ActivityTypes,
    (state: GameState, activityId: string) => ActivityStartResult
>()
export const activityTitles = new MapEx<ActivityTypes, (state: GameState, activityId: string) => string>()
export const activityIcons = new MapEx<ActivityTypes, (state: GameState, activityId: string) => Icons | ReactNode>()
export const activityViewers = new MapEx<ActivityTypes, (state: GameState, activity: ActivityState) => void>()
