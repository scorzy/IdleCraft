import { makeMemoizedRecipe } from '../crafting/makeMemoizedRecipe'
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
import { Item, ItemSubType } from '../items/Item'
import { selectGameItem } from '../storage/StorageSelectors'
import { MAX_INGREDIENTS } from './alchemyConst'
import { generatePotion } from './alchemyFunctions'
import { PotionResult } from './alchemyTypes'
import { Effects } from '../effects/types/Effects'
import { isPotionItem, PotionCraftingResult } from './PotionCraftingResult'

const PotionRecipeParameters: RecipeParameterItemFilter[] = [
    {
        id: 'Flask',
        nameId: 'Flask',
        type: RecipeParamType.ItemType,
        itemFilter: {
            descriptionId: 'Flask',
            has: ['flaskData'],
        },
    },
    {
        id: 'Solvent',
        nameId: 'Solvent',
        type: RecipeParamType.ItemType,
        itemFilter: {
            descriptionId: 'Solvent',
            has: ['solventData'],
        },
    },

    {
        id: 'Ingredient1',
        nameId: 'Ingredient',
        type: RecipeParamType.ItemType,
        itemFilter: {
            descriptionId: 'Ingredient',
            has: ['ingredientData'],
        },
    },
    {
        id: 'Ingredient2',
        nameId: 'Ingredient',
        type: RecipeParamType.ItemType,
        itemFilter: {
            descriptionId: 'Ingredient',
            has: ['ingredientData'],
        },
    },
]
export const potionRecipe: Recipe = makeMemoizedRecipe({
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

        const ingredients: Item[] = []

        for (let i = 1; i <= MAX_INGREDIENTS; i++) {
            const ingredientId = params.find((p) => p.id === `Ingredient${i}`)?.itemId
            if (!ingredientId) continue
            if (ingredients.some((i) => i.id === ingredientId)) continue
            const ingredient = selectGameItem(ingredientId)(state)
            if (!ingredient?.ingredientData) return
            ingredients.push(ingredient)
        }

        if (ingredients.length < 2) return

        const realPotion = generatePotion(state, true, ingredients)
        const uiPotion = generatePotion(state, false, ingredients)

        const result: PotionCraftingResult = {
            time: 5e3,
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
    afterCrafting: (state: GameState, _params: RecipeParameterValue[], result: RecipeResult) => {
        const effects: Effects[] = []
        for (const res of result.results) {
            if (!isPotionItem(res)) continue
            if (res.potionResult === PotionResult.NotPotion) continue

            res.craftedItem?.potionData?.effects?.forEach((e) => {
                if (!effects.includes(e.effect)) effects.push(e.effect)
            })
        }

        result.requirements.forEach((req) => {
            const item = selectGameItem(req.itemId)(state)
            if (!item) return
            if (item?.ingredientData) discoverAlchemyEffects(state, item, effects)
        })
    },
})

export const discoverAlchemyEffects = (state: GameState, item: Item, effects: Effects[]) => {
    if (!effects.length) return
    if (!state.discoveredEffects[item.id]) state.discoveredEffects[item.id] = []

    const itemEffects = selectGameItem(item.id)(state)?.ingredientData?.effects
    if (!itemEffects) return

    effects.forEach((effect) => {
        if (itemEffects.some((pf) => pf.effect === effect) && !state.discoveredEffects[item.id]?.includes(effect))
            state.discoveredEffects[item.id]!.push(effect)
    })
}
