import { ActivityTypes } from '../activities/ActivityState'
import { activities } from '../activities/makeActivityFun'
import { CraftingActivity } from '../crafting/CraftingActivity'
import { MiningActivity } from '../mining/MiningActivity'
import { WoodcuttingActivity } from '../wood/WoodcuttingActivity'
import { GameState } from './GameState'

export function initialize() {
    activities.set(ActivityTypes.Crafting, (state: GameState, id: string) => new CraftingActivity(state, id))
    activities.set(ActivityTypes.Mining, (state: GameState, id: string) => new MiningActivity(state, id))
    activities.set(ActivityTypes.Woodcutting, (state: GameState, id: string) => new WoodcuttingActivity(state, id))
}
