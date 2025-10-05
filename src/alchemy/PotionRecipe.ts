import { Recipe } from '../crafting/Recipe'
import {
    RecipeParameter,
    RecipeParameterItemFilter,
    RecipeParameterValue,
    RecipeParamType,
    RecipeResult,
    RecipeTypes,
} from '../crafting/RecipeInterfaces'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { ItemSubType } from '../items/Item'
import { selectGameItem } from '../storage/StorageSelectors'
import { MAX_INGREDIENTS } from './alchemyConst'
import { AlchemyEffects, AlchemyPotency } from './alchemyTypes'

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
    getResult: function (state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
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

        const allEffects = new Map<AlchemyEffects, AlchemyPotency[]>()

        for (const ingredient of ingredients) {
            for (const effect of ingredient.ingredientData!.effects) {
                if (!allEffects.has(effect.effect)) allEffects.set(effect.effect, [])
                allEffects.get(effect.effect)!.push(effect.potency)
            }
        }

        allEffects.forEach((potencies, effect) => {
            if (potencies.length < 2) {
                allEffects.delete(effect)
                return
            }
        })

        if (allEffects.size === 0) return

        const result: RecipeResult = {
            time: 3e3,
            requirements: [],
            results: [],
        }
        return result
    },
}
