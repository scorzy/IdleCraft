import { BonusResult } from '../bonus/Bonus'
import { RecipeItem, RecipeResult } from '../crafting/RecipeInterfaces'
import { Item } from '../items/Item'
import { PotionResult } from './alchemyTypes'

export interface PotionItem extends RecipeItem {
    stability: number
    potionResult: PotionResult
    potionResultBonusList: BonusResult | undefined
    unknownEffects: boolean
    uiCraftedItem: Item | undefined
}

export interface PotionCraftingResult extends RecipeResult {
    results: PotionItem[]
}
