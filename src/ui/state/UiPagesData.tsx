import { UiPages, UiPageData } from './UiPages'
import { GiMining, GiWoodAxe } from 'react-icons/gi'
import { RecipeTypes } from '../../crafting/RecipeInterfaces'
import { LuBox, LuLayoutList } from 'react-icons/lu'

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
}
