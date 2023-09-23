import { SmithingRecipes } from '../smithing/SmithingRecipes'
import { WoodRecipes } from '../wood/WoodRecipes'
import { Recipe } from './Recipe'

export const Recipes = { ...WoodRecipes, ...SmithingRecipes } satisfies { [k: string]: Recipe }
