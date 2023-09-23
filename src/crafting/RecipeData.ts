import { ExpEnum } from '../experience/expEnum'
import { RecipeTypes } from './RecipeInterfaces'

export const RecipeData: { [k in RecipeTypes]: { expType: ExpEnum } } = {
    [RecipeTypes.Woodworking]: { expType: ExpEnum.Woodworking },
    [RecipeTypes.Smithing]: { expType: ExpEnum.Smithing },
}
