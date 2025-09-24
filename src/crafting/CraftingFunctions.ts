import { Item } from '../items/Item'
import { Recipe } from './Recipe'
import { changeRecipe } from './RecipeFunctions'

export const handleRecipeChange = (value: Recipe | null) => changeRecipe(value?.id || null)
export function getItemValue(components: Item[], isFinalItem: boolean): number {
    let value = 0
    for (const comp of components) value += comp.value
    let prestige = 1
    if (isFinalItem) for (const comp of components) if (comp.craftingData) prestige *= comp.craftingData.prestige

    return Math.floor(value * prestige)
}
export function getCraftingTime(components: Item[]): number {
    return components.length * 1.5e3
}
