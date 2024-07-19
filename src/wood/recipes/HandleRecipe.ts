import { Recipe } from '../../crafting/Recipe'
import {
    RecipeParameter,
    RecipeParamType,
    RecipeTypes,
    RecipeParameterValue,
    RecipeResult,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { ItemSubType, ItemTypes } from '../../items/Item'
import { WoodData } from '../WoodData'

export const PlankToHandle = new Map<string, string>()
Object.values(WoodData).forEach((w) => PlankToHandle.set(w.plankId, w.handleId))

export const handleParam: RecipeParameter[] = [
    {
        id: 'plank',
        nameId: 'Plank',
        type: RecipeParamType.ItemType,
        itemType: ItemTypes.Plank,
    },
]

export const HandleRecipe: Recipe = {
    id: 'handleRecipe',
    type: RecipeTypes.Woodworking,
    nameId: 'Handle',
    iconId: Icons.Handle,
    itemSubType: ItemSubType.Crafting,
    getParameters: () => handleParam,
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const plank = params.find((i) => i.id === 'plank')
        if (plank === undefined) return
        if (!plank.stdItemId) return
        const id = PlankToHandle.get(plank.stdItemId)
        if (!id) throw new Error(`PlankToHandle not found ${plank.stdItemId}`)
        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    stdItemId: plank.stdItemId,
                },
            ],
            results: [{ id, qta: 1, stdItemId: PlankToHandle.get(plank.stdItemId) }],
        }
    },
}
