import { CraftingActivity } from '../crafting/CraftingActivity'
import { MiningActivity } from '../mining/MiningActivity'
import { WoodcuttingActivity } from '../wood/WoodcuttingActivity'
import { GameState } from './GameState'
import { Provider } from './Provider'

export function populateProvider() {
    Provider.makeWoodcuttingActivity = (state: GameState, id: string) => new WoodcuttingActivity(state, id)
    Provider.makeCraftingActivity = (state: GameState, id: string) => new CraftingActivity(state, id)
    Provider.makeMiningActivity = (state: GameState, id: string) => new MiningActivity(state, id)
}
