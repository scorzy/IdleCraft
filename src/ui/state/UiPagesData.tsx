import { GiAnvil, GiCrossedSwords, GiMining, GiUpgrade, GiWoodAxe } from 'react-icons/gi'
import { LuBox, LuLayoutList } from 'react-icons/lu'
import { TbCirclePlus } from 'react-icons/tb'
import { RecipeTypes } from '../../crafting/RecipeInterfaces'
import { UiPages, UiPageData } from './UiPages'

export const UiPagesData: { [k in UiPages]: UiPageData } = {
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
    [UiPages.Perks]: {
        nameId: 'Perks',
        icon: <GiUpgrade />,
    },
    [UiPages.Points]: {
        nameId: 'Attributes',
        icon: <TbCirclePlus />,
    },
    [UiPages.CombatZones]: {
        nameId: 'CombatZones',
        icon: <GiCrossedSwords />,
    },
    [UiPages.Combat]: {
        nameId: 'Combat',
        icon: <GiCrossedSwords />,
    },
}
