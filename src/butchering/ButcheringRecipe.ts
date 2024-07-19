import { DeadAnimals } from '../characters/templates/charItems'
import { Recipe } from '../crafting/Recipe'
import {
    RecipeParameter,
    RecipeParamType,
    RecipeTypes,
    RecipeParameterValue,
    RecipeResult,
} from '../crafting/RecipeInterfaces'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { ItemTypes, ItemSubType } from '../items/Item'
import { handleParam } from '../wood/recipes/HandleRecipe'

export const butcheringRecipeParam: RecipeParameter[] = [
    {
        id: 'corpse',
        nameId: 'Corpse',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Corpse,
    },
]

export const butcheringRecipe: Recipe = {
    id: 'butcheringRecipe',
    type: RecipeTypes.Butchering,
    nameId: 'Butchering',
    iconId: Icons.Dagger,
    itemSubType: ItemSubType.Crafting,
    getParameters: () => handleParam,
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const corpse = params.find((i) => i.id === 'corpse')
        if (!corpse) return
        if (!corpse.stdItemId) return

        const animal = DeadAnimals[corpse.stdItemId]
        if (!animal) return
        if (!animal.butchering) return

        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    stdItemId: corpse.stdItemId,
                },
            ],
            results: animal.butchering,
        }
    },
}
