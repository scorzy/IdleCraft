import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { ItemSubType } from '../items/Item'
import { Msg } from '../msg/Msg'
import { RecipeParameter, RecipeParameterValue, RecipeResult, RecipeTypes } from './RecipeInterfaces'

export interface Recipe {
    id: string
    nameId: keyof Msg
    iconId: Icons
    type: RecipeTypes
    itemSubType: ItemSubType
    getParameters: (state: GameState) => RecipeParameter[]
    getResult: (state: GameState, params: RecipeParameterValue[]) => RecipeResult | undefined
    afterCrafting?: (state: GameState, params: RecipeParameterValue[], result: RecipeResult) => void
}
