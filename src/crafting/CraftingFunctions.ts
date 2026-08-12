import { Item } from '../items/Item'
import { Recipe } from './Recipe'
import { changeRecipe, changeRecipeGroup } from './RecipeFunctions'
import { RecipeGroups } from './RecipeInterfaces'

export const handleRecipeChange = (value: Recipe | null) => changeRecipe(value?.id || null)
export const handleRecipeGroupChange = (value: RecipeGroups) => changeRecipeGroup(value)
export function getItemValue(components: Item[], isFinalItem: boolean): number {
    let value = 0
    for (const comp of components) value += comp.value
    let prestige = 1
    if (isFinalItem) for (const comp of components) if (comp.craftingData) prestige *= comp.craftingData.prestige

    return Math.floor(value * prestige)
}
export function getItemVolume(components: Item[]): number {
    let volume = 0
    for (const comp of components) volume += comp.volume
    return volume
}
export function getCraftingTime(components: Item[]): number {
    return components.length * 1.5e3
}
