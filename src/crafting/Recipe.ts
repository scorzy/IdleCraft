import { GameState } from '../game/GameState'
import { Item, ItemTypes } from '../items/Item'
import { Msg } from '../msg/Msg'

export enum RecipeTypes {
    Woodworking = 'Woodworking',
}
export enum RecipeParamType {
    ItemType = 'ItemType',
}

export interface RecipeParameter {
    id: string
    nameId: keyof Msg
    type: RecipeParamType
    itemType?: ItemTypes
    stdItem?: string
}
export interface RecipeParameterValue {
    id: string
    stdItemId?: string | null
    craftItemId?: string | null
}
export interface RecipeItemReq {
    qta: number
    stdItemId?: string | null
    craftedItemId?: string | null
}
export interface RecipeItem {
    qta: number
    stdItemId?: string
    craftedItemId?: Item
}
export interface RecipeResult {
    time: number
    requirements: RecipeItemReq[]
    results: RecipeItem
}
export interface Recipe {
    id: string
    nameId: keyof Msg
    type: RecipeTypes
    getParameters(state: GameState): RecipeParameter[]
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined
}
