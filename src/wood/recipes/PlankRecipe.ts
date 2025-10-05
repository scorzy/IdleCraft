import { makeMemoizedRecipe } from '../../crafting/makeMemoizedRecipe'
import {
    RecipeParamType,
    RecipeParameterItemFilter,
    RecipeParameterValue,
    RecipeResult,
    RecipeTypes,
} from '../../crafting/RecipeInterfaces'
import { GameState } from '../../game/GameState'
import { Icons } from '../../icons/Icons'
import { ItemSubType, ItemTypes } from '../../items/Item'
import { WoodData } from '../WoodData'

export const LogToPlank = new Map<string, string>()
Object.values(WoodData).forEach((w) => LogToPlank.set(w.logId, w.plankId))

export const plankParam: RecipeParameterItemFilter[] = [
    {
        id: 'log',
        nameId: 'Log',
        type: RecipeParamType.ItemType,
        itemFilter: { itemType: ItemTypes.Log },
    },
]

export const plankRecipe = makeMemoizedRecipe({
    id: 'PlankRecipe',
    type: RecipeTypes.Woodworking,
    nameId: 'Plank',
    iconId: Icons.Plank,
    itemSubType: ItemSubType.Crafting,
    getParameters: () => plankParam,
    getResult: function (_: GameState, params: RecipeParameterValue[]): RecipeResult | undefined {
        const log = params.find((i) => i.id === 'log')
        if (!log) return
        if (!log.itemId) return

        const id = LogToPlank.get(log.itemId)
        if (!id) throw new Error(`LogToPlank not found ${log.itemId}`)

        return {
            time: 3000,
            requirements: [
                {
                    qta: 1,
                    itemId: log.itemId,
                },
            ],
            results: [
                {
                    id,
                    qta: 1,
                    stdItemId: id,
                },
            ],
        }
    },
})
