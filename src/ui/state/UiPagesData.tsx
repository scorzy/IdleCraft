import { TbCube, TbList } from 'react-icons/tb'
import { UiPages, UiPageData } from './UiPages'
import { GiWoodAxe } from 'react-icons/gi'
import { RecipeTypes } from '../../crafting/Recipe'

export const UiPagesData: { [k in UiPages]: UiPageData } = {
    [UiPages.Activities]: {
        nameId: 'Activities',
        icon: <TbList />,
    },
    [UiPages.Storage]: {
        nameId: 'Storage',
        icon: <TbCube />,
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
}
