import { ReactNode } from 'react'
import { Msg } from '../../msg/Msg'
import { RecipeTypes } from '../../crafting/Recipe'

export enum UiPages {
    Activities = 'Activities',
    Storage = 'Storage',
    Woodcutting = 'Woodcutting',
    Woodworking = 'Woodworking',
}
export interface UiPageData {
    nameId: keyof Msg
    icon: ReactNode
    recipeType?: RecipeTypes
}
