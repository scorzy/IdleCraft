import { RecipeResult } from '../crafting/RecipeInterfaces'
import { PotionResult } from './alchemyTypes'

export interface PotionCraftingResult extends RecipeResult {
    stability: number
    potionResult: PotionResult
}
