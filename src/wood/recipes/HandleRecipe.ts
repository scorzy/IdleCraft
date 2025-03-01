import { makeRecipe } from '../../crafting/makeRecipe'
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

export const handleRecipe = makeRecipe({
    id: 'handleRecipe',
    type: RecipeTypes.Woodworking,
    nameId: 'Handle',
    iconId: Icons.Handle,
    itemSubType: ItemSubType.Crafting,
    getParameters: () => handleParam,
    getResult: function (_state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const plank = params.find((i) => i.id === 'plank')
        if (plank === undefined) return
        if (!plank.itemId) return
        const id = PlankToHandle.get(plank.itemId)
        if (!id) throw new Error(`PlankToHandle not found ${plank.itemId}`)
        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    itemId: plank.itemId,
                },
            ],
            results: [{ id, qta: 1, stdItemId: PlankToHandle.get(plank.itemId) }],
        }
    },
})
