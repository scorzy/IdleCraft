import { GameState } from '../game/GameState'
import { Item } from '../items/Item'
import { StdItems } from '../items/stdItems'
export enum RecipeParamType {
    ItemType = 'ItemType',
}
export interface RecipeParameter {
    id: string
    nameId: string
    type: RecipeParamType
    stdItem?: keyof typeof StdItems
}
export interface RecipeItemReq {
    qta: number
    stdItem?: keyof typeof StdItems
    craftedItem?: string
}
export interface RecipeItem {
    qta: number
    stdItem?: keyof typeof StdItems
    craftedItem?: Item
}
export interface RecipeResult {
    time: number
    requirements: RecipeItemReq[]
    results: RecipeItem
}
export interface Recipe {
    id: string
    getParameters(state: GameState): RecipeParameter[]
    getResult(state: GameState, params: RecipeParameter[]): RecipeResult | undefined
}
