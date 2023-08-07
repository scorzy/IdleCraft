import { WoodRecipes } from '../wood/WoodRecipes'
import { Recipe } from './Recipe'

export const Recipes = {
    ...WoodRecipes,
} satisfies { [k: string]: Recipe }
