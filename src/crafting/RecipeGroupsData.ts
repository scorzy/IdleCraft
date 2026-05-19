import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { RecipeGroups, RecipeTypes } from './RecipeInterfaces'

export const RecipeGroupsList: RecipeGroups[] = [RecipeGroups.Armours, RecipeGroups.Weapons, RecipeGroups.Others]

export const RecipeGroupsData: Record<RecipeGroups, { nameId: keyof Msg; icon: Icons }> = {
    [RecipeGroups.Armours]: { nameId: 'Armours', icon: Icons.Shield },
    [RecipeGroups.Weapons]: { nameId: 'Weapons', icon: Icons.CrossedSwords },
    [RecipeGroups.Others]: { nameId: 'Others', icon: Icons.SwapBag },
}

export function getDefaultRecipeGroup(recipeType: RecipeTypes | undefined): RecipeGroups | undefined {
    if (recipeType === RecipeTypes.Smithing) return RecipeGroups.Armours
}
