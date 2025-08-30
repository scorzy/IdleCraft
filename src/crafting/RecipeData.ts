import { ExpEnum } from '@/experience/ExpEnum.1'
import { RecipeTypes } from './RecipeInterfaces'

export const RecipeData: Record<RecipeTypes, { expType: ExpEnum }> = {
    [RecipeTypes.Woodworking]: { expType: ExpEnum.Woodworking },
    [RecipeTypes.Smithing]: { expType: ExpEnum.Smithing },
    [RecipeTypes.Butchering]: { expType: ExpEnum.Butchering },
}
