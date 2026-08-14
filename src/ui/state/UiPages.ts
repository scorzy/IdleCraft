import { ReactNode } from 'react'
import { RecipeTypes } from '../../crafting/RecipeInterfaces'
import { Msg } from '../../msg/Msg'

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
    World = 'World',
    Butchering = 'Butchering',
    Quest = 'Quest',
    Alchemy = 'Alchemy',
    Caravans = 'Caravans',
}
export interface UiPageData {
    nameId: keyof Msg
    icon: ReactNode
    recipeType?: RecipeTypes
}
