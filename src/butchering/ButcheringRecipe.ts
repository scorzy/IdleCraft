import { DeadAnimals } from '../characters/templates/DeadAnimals'
import { makeRecipe } from '../crafting/makeRecipe'
import {
    RecipeParameterItemFilter,
    RecipeParameterValue,
    RecipeParamType,
    RecipeResult,
    RecipeTypes,
} from '../crafting/RecipeInterfaces'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { ItemSubType, ItemTypes } from '../items/Item'

export const butcheringRecipeParam: RecipeParameterItemFilter[] = [
    {
        id: 'corpse',
        nameId: 'Corpse',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Corpse },
    },
]

export const butcheringRecipe = makeRecipe({
    id: 'butcheringRecipe',
    type: RecipeTypes.Butchering,
    nameId: 'Butchering',
    iconId: Icons.MeatCleaver,
    itemSubType: ItemSubType.Crafting,
    getParameters: () => butcheringRecipeParam,
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const corpse = params.find((i) => i.id === 'corpse')
        if (!corpse) return
        if (!corpse.itemId) return

        const animal = DeadAnimals[corpse.itemId]
        if (!animal) return
        if (!animal.butchering) return

        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    itemId: corpse.itemId,
                },
            ],
            results: animal.butchering,
        }
    },
})
