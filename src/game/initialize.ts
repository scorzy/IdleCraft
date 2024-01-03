import { ActivityTypes } from '../activities/ActivityState'
import { recipes } from '../crafting/Recipes'
import { execCrafting } from '../crafting/functions/execCrafting'
import { getCraftingIcon } from '../crafting/functions/getCraftingIcon'
import { getCraftingTitle } from '../crafting/functions/getCraftingTitle'
import { removeCrafting } from '../crafting/functions/removeCrafting'
import { startCrafting } from '../crafting/functions/startCrafting'
import { execMining } from '../mining/functions/execMining'
import { getMiningIcon } from '../mining/functions/getMiningIcon'
import { getMiningTitle } from '../mining/functions/getMiningTitle'
import { removeMining } from '../mining/functions/removeMining'
import { startMining } from '../mining/functions/startMining'
import { AxeRecipe } from '../smithing/recipes/AxeRecipe'
import { BarRecipe } from '../smithing/recipes/BarRecipe'
import { PickaxeRecipe } from '../smithing/recipes/PickaxeRecipe'
import { execTreeGrow } from '../wood/forest/execTreeGrow'
import { execWoodcutting } from '../wood/functions/execWoodcutting'
import { getWoodcuttingIcon } from '../wood/functions/getWoodcuttingIcon'
import { getWoodcuttingTitle } from '../wood/functions/getWoodcuttingTitle'
import { removeWoodcutting } from '../wood/functions/removeWoodcutting'
import { startWoodcutting } from '../wood/functions/startWoodcutting'
import { HandleRecipe } from '../wood/recipes/HandleRecipe'
import { PlankRecipe } from '../wood/recipes/PlankRecipe'
import { activityIcons, activityRemovers, activityStarters, activityTitles, activityExecutors } from './globals'

export function initialize() {
    initActivities()
    initRecipes()
}

function initActivities() {
    activityExecutors.set(ActivityTypes.Woodcutting, execWoodcutting)
    activityRemovers.set(ActivityTypes.Woodcutting, removeWoodcutting)
    activityStarters.set(ActivityTypes.Woodcutting, startWoodcutting)
    activityTitles.set(ActivityTypes.Woodcutting, getWoodcuttingTitle)
    activityIcons.set(ActivityTypes.Woodcutting, getWoodcuttingIcon)

    activityExecutors.set(ActivityTypes.Mining, execMining)
    activityRemovers.set(ActivityTypes.Mining, removeMining)
    activityStarters.set(ActivityTypes.Mining, startMining)
    activityTitles.set(ActivityTypes.Mining, getMiningTitle)
    activityIcons.set(ActivityTypes.Mining, getMiningIcon)

    activityExecutors.set(ActivityTypes.Crafting, execCrafting)
    activityRemovers.set(ActivityTypes.Crafting, removeCrafting)
    activityStarters.set(ActivityTypes.Crafting, startCrafting)
    activityTitles.set(ActivityTypes.Crafting, getCraftingTitle)
    activityIcons.set(ActivityTypes.Crafting, getCraftingIcon)

    activityExecutors.set(ActivityTypes.Tree, execTreeGrow)
}

function initRecipes() {
    recipes.set(PlankRecipe.id, PlankRecipe)
    recipes.set(HandleRecipe.id, HandleRecipe)
    recipes.set(BarRecipe.id, BarRecipe)
    recipes.set(AxeRecipe.id, AxeRecipe)
    recipes.set(PickaxeRecipe.id, PickaxeRecipe)
}
