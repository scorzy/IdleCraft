import { SmithingRecipes } from '../smithing/SmithingRecipes'
import { WoodRecipes } from '../wood/WoodRecipes'
import { Recipe } from './Recipe'

export const Recipes: Record<string, Recipe> = { ...WoodRecipes, ...SmithingRecipes }
