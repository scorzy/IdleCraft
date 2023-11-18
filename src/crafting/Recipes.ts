import { SmithingRecipes } from '../smithing/SmithingRecipes'
import { WoodRecipes } from '../wood/WoodRecipes'
import { Recipe } from './Recipe'

export const Recipes: { [k in string]?: Recipe } = { ...WoodRecipes, ...SmithingRecipes }
