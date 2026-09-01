import { CharacterItem } from '../characters/templates/characterInterfaces'
import { makeMemoizedRecipe } from '../crafting/makeMemoizedRecipe'
import {
    RecipeParameterItemFilter,
    RecipeParameterValue,
    RecipeParamType,
    RecipeResult,
    RecipeTypes,
} from '../crafting/RecipeInterfaces'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { Item, ItemType, CraftingType } from '../items/Item'
import { StdItems } from '../items/stdItems'

export const butcheringRecipeParam: RecipeParameterItemFilter[] = [
    {
        id: 'corpse',
        nameId: 'Corpse',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemType.Crafting, craftingTypes: [CraftingType.Corpse] },
    },
]

function isCharacterCorpse(item: Item): item is CharacterItem {
    return 'butchering' in item
}

export const butcheringRecipe = makeMemoizedRecipe({
    id: 'butcheringRecipe',
    type: RecipeTypes.Butchering,
    nameId: 'Butchering',
    iconId: Icons.MeatCleaver,
    getParameters: () => butcheringRecipeParam,
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const corpse = params.find((i) => i.id === 'corpse')
        if (!corpse) return
        if (!corpse.itemId) return

        const animal = StdItems[corpse.itemId]
        if (!animal) return
        if (!isCharacterCorpse(animal) || !animal.butchering) return

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
