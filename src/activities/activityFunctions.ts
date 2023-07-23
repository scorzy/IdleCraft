import { GameState } from '../game/GameState'
import { WoodcuttingActivity } from '../wood/WoodcuttingActivity'
import { AbstractActivity } from './AbstractActivity'
import { ActivityTypes } from './ActivityState'

export function makeActivityFun(state: GameState, type: ActivityTypes, id: string): AbstractActivity<unknown> {
    switch (type) {
        case ActivityTypes.Woodcutting:
            new WoodcuttingActivity(state, id)
    }
    throw new Error(`[getActivityFun] activity not found ${type}`)
}
