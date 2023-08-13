import { GameState } from '../game/GameState'
import { Msg } from '../msg/Msg'
import { RecipeTypes, RecipeParameter, RecipeParameterValue, RecipeResult } from './RecipeInterfaces'

export interface Recipe {
    id: string
    nameId: keyof Msg
    type: RecipeTypes
    getParameters(state: GameState): RecipeParameter[]
    getResult(state: GameState, params: RecipeParameterValue[]): RecipeResult | undefined
}
