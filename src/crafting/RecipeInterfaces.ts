import { Item, ItemFilter } from '../items/Item'
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
}

export interface RecipeParameterItemFilter extends RecipeParameter {
    itemFilter: ItemFilter
}

export function isRecipeParameterItemFilter(param: RecipeParameter): param is RecipeParameterItemFilter {
    return param.type === RecipeParamType.ItemType
}

export interface RecipeParameterItemStd extends RecipeParameter {
    stdItem: string
}
export function isRecipeParameterItemStd(param: RecipeParameter): param is RecipeParameterItemStd {
    return param.type === RecipeParamType.ItemType
}

export interface RecipeParameterValue {
    id: string
    itemId: string
}
export interface RecipeItemReq {
    qta: number
    itemId: string
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
