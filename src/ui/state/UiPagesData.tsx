import { GiAnvil, GiCrossedSwords, GiMeatCleaver, GiMining, GiTiedScroll, GiWoodAxe } from 'react-icons/gi'
import { LuBox, LuLayoutList } from 'react-icons/lu'
import { TbUsers } from 'react-icons/tb'
import { RecipeTypes } from '../../crafting/RecipeInterfaces'
import { IconsData, Icons } from '../../icons/Icons'
import { UiPages, UiPageData } from './UiPages'

export const UiPagesData: Record<UiPages, UiPageData> = {
    [UiPages.Activities]: {
        nameId: 'Activities',
        icon: <LuLayoutList />,
    },
    [UiPages.Storage]: {
        nameId: 'Storage',
        icon: <LuBox />,
    },
    [UiPages.Woodcutting]: {
        nameId: 'Woodcutting',
        icon: <GiWoodAxe />,
    },
    [UiPages.Woodworking]: {
        nameId: 'Woodworking',
        icon: <GiWoodAxe />,
        recipeType: RecipeTypes.Woodworking,
    },
    [UiPages.Mining]: {
        nameId: 'Mining',
        icon: <GiMining />,
    },
    [UiPages.Smithing]: {
        nameId: 'Smithing',
        icon: <GiAnvil />,
        recipeType: RecipeTypes.Smithing,
    },
    [UiPages.CombatZones]: {
        nameId: 'CombatZones',
        icon: <GiCrossedSwords />,
    },
    [UiPages.Combat]: {
        nameId: 'Combat',
        icon: <GiCrossedSwords />,
    },
    [UiPages.Characters]: {
        nameId: 'Characters',
        icon: <TbUsers />,
    },
    [UiPages.Butchering]: {
        nameId: 'Butchering',
        icon: <GiMeatCleaver />,
        recipeType: RecipeTypes.Butchering,
    },
    [UiPages.Alchemy]: {
        nameId: 'Alchemy',
        icon: IconsData[Icons.Potion],
        recipeType: RecipeTypes.Alchemy,
    },
    [UiPages.Quest]: {
        nameId: 'Quests',
        icon: <GiTiedScroll />,
    },
}
