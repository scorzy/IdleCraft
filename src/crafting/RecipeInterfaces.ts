import { Item, ItemTypes } from '../items/Item'
import { Msg } from '../msg/Msg'

export enum RecipeTypes {
    Woodworking = 'Woodworking',
    Smithing = 'Smithing',
    Butchering = 'Butchering',
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
    id: string
    qta: number
    stdItemId?: string
    craftedItem?: Item
}
export interface RecipeResult {
    time: number
    requirements: RecipeItemReq[]
    results: RecipeItem[]
}
