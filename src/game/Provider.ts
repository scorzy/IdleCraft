import { AbstractActivity } from '../activities/AbstractActivity'
import { GameState } from './GameState'

export class Provider {
    static makeWoodcuttingActivity: ((state: GameState, id: string) => AbstractActivity<unknown>) | null = null
    static makeCraftingActivity: ((state: GameState, id: string) => AbstractActivity<unknown>) | null = null
}
