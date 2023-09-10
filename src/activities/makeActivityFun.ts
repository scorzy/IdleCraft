import { GameState } from '../game/GameState'
import { Provider } from '../game/Provider'
import { AbstractActivity } from './AbstractActivity'
import { ActivityTypes } from './ActivityState'

export function makeActivityFun(state: GameState, type: ActivityTypes, id: string): AbstractActivity<unknown> {
    switch (type) {
        case ActivityTypes.Woodcutting:
            return Provider.makeWoodcuttingActivity!(state, id)

        case ActivityTypes.Crafting:
            return Provider.makeCraftingActivity!(state, id)

        case ActivityTypes.Mining:
            return Provider.makeMiningActivity!(state, id)
    }
}
