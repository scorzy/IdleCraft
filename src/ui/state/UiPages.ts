import { ReactNode } from 'react'
import { Msg } from '../../msg/Msg'
import { RecipeTypes } from '../../crafting/RecipeInterfaces'

export enum UiPages {
    Activities = 'Activities',
    Storage = 'Storage',
    Woodcutting = 'Woodcutting',
    Woodworking = 'Woodworking',
    Mining = 'Mining',
    Smithing = 'Smithing',
    Perks = 'Perks',
    Points = 'Points',
    CombatZones = 'CombatZones',
}
export interface UiPageData {
    nameId: keyof Msg
    icon: ReactNode
    recipeType?: RecipeTypes
}
