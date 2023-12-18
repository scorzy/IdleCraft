import { ActivityTypes } from '../activities/ActivityState'
import { activities } from '../activities/makeActivityFun'
import { BattleActivity } from '../battle/BattleActivity'
import { CraftingActivity } from '../crafting/CraftingActivity'
import { recipes } from '../crafting/Recipes'
import { MiningActivity } from '../mining/MiningActivity'
import { WoodcuttingActivity } from '../wood/WoodcuttingActivity'
import { HandleRecipe } from '../wood/recipes/HandleRecipe'
import { PlankRecipe } from '../wood/recipes/PlankRecipe'
import { GameState } from './GameState'
import { BarRecipe } from '@/smithing/recipes/BarRecipe'
import { AxeRecipe } from '@/smithing/recipes/AxeRecipe'
import { PickaxeRecipe } from '@/smithing/recipes/PickaxeRecipe'

export function initialize() {
    initActivities()
    initRecipes()
}

function initActivities() {
    activities.set(ActivityTypes.Crafting, (state: GameState, id: string) => new CraftingActivity(state, id))
    activities.set(ActivityTypes.Mining, (state: GameState, id: string) => new MiningActivity(state, id))
    activities.set(ActivityTypes.Woodcutting, (state: GameState, id: string) => new WoodcuttingActivity(state, id))
    activities.set(ActivityTypes.Battle, (state: GameState, id: string) => new BattleActivity(state, id))
}

function initRecipes() {
    recipes.set(PlankRecipe.id, PlankRecipe)
    recipes.set(HandleRecipe.id, HandleRecipe)
    recipes.set(BarRecipe.id, BarRecipe)
    recipes.set(AxeRecipe.id, AxeRecipe)
    recipes.set(PickaxeRecipe.id, PickaxeRecipe)
}
