import { Recipe } from '../crafting/Recipe'
import {
    RecipeParameter,
    RecipeParameterItemFilter,
    RecipeParameterValue,
    RecipeParamType,
    RecipeTypes,
} from '../crafting/RecipeInterfaces'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { ItemSubType } from '../items/Item'
import { selectGameItem } from '../storage/StorageSelectors'
import { MAX_INGREDIENTS } from './alchemyConst'
import { generatePotion } from './alchemyFunctions'
import { PotionResult } from './alchemyTypes'
import { PotionCraftingResult } from './PotionCraftingResult'

const PotionRecipeParameters: RecipeParameterItemFilter[] = [
    {
        id: 'Solvent',
        nameId: 'Solvent',
        type: RecipeParamType.ItemType,
        itemFilter: {
            has: ['solventData'],
        },
    },
    {
        id: 'Flask',
        nameId: 'Flask',
        type: RecipeParamType.ItemType,
        itemFilter: {
            has: ['flaskData'],
        },
    },
    {
        id: 'Ingredient1',
        nameId: 'Ingredient',
        type: RecipeParamType.ItemType,
        itemFilter: {
            has: ['ingredientData'],
        },
    },
    {
        id: 'Ingredient2',
        nameId: 'Ingredient',
        type: RecipeParamType.ItemType,
        itemFilter: {
            has: ['ingredientData'],
        },
    },
]
export const PotionRecipe: Recipe = {
    id: 'Potion',
    nameId: 'Potion',
    iconId: Icons.Potion,
    type: RecipeTypes.Alchemy,
    itemSubType: ItemSubType.Potion,
    getParameters: function (_state: GameState): RecipeParameter[] {
        return PotionRecipeParameters
    },
    getResult: function (state: GameState, params: RecipeParameterValue[]): PotionCraftingResult | undefined {
        const solventId = params.find((p) => p.id === 'Solvent')?.itemId
        if (!solventId) return

        const flaskId = params.find((p) => p.id === 'Flask')?.itemId
        if (!flaskId) return

        const solvent = selectGameItem(solventId)(state)
        if (!solvent?.solventData) return

        const flask = selectGameItem(flaskId)(state)
        if (!flask?.flaskData) return

        const ingredients = []

        for (let i = 1; i <= MAX_INGREDIENTS; i++) {
            const ingredientId = params.find((p) => p.id === `Ingredient${i}`)?.itemId
            if (!ingredientId) continue
            const ingredient = selectGameItem(ingredientId)(state)
            if (!ingredient?.ingredientData) return
            ingredients.push(ingredient)
        }

        if (ingredients.length < 2) return

        const realPotion = generatePotion(state, false, ingredients)
        const uiPotion = generatePotion(state, false, ingredients)

        const result: PotionCraftingResult = {
            time: 0,
            requirements: [
                {
                    itemId: solventId,
                    qta: 1,
                },
                {
                    itemId: flaskId,
                    qta: 1,
                },
                ...ingredients.map((i) => ({
                    itemId: i.id,
                    qta: 1,
                })),
            ],
            results: [
                {
                    id: 'craftedPotion',
                    qta: 1,
                    stability: uiPotion?.stability ?? 0,
                    potionResult: uiPotion?.potionResult ?? PotionResult.NotPotion,
                    craftedItem: realPotion?.item,
                    uiCraftedItem: uiPotion?.item,
                    unknownEffects: uiPotion?.unknownEffects ?? false,
                    potionResultBonusList: uiPotion?.potionResultBonusList,
                },
            ],
        }

        return result
    },
}
