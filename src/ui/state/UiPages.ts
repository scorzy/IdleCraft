import { ReactNode } from 'react'
import { Msg } from '../../msg/Msg'
import { RecipeTypes } from '../../crafting/RecipeInterfaces'

export enum UiPages {
    Activities = 'Activities',
    Storage = 'Storage',
    Woodcutting = 'Woodcutting',
    Woodworking = 'Woodworking',
    Mining = 'Mining',
    Gathering = 'Gathering',
    Smithing = 'Smithing',
    CombatZones = 'CombatZones',
    Combat = 'Combat',
    Characters = 'Characters',
    Butchering = 'Butchering',
    Quest = 'Quest',
    Alchemy = 'Alchemy',
}
export interface UiPageData {
    nameId: keyof Msg
    icon: ReactNode
    recipeType?: RecipeTypes
}
