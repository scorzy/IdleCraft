import { ReactNode } from 'react'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'

// eslint-disable-next-line import/no-unused-modules
export interface AbilityParams {
    gameState: GameState
    charSource: string
}
export interface AbilityResult {
    gameState: GameState
}
export interface ActiveAbility {
    id: string
    nameId: keyof Msg
    getDesc(params: AbilityParams): ReactNode
    getIconId(params: AbilityParams): Icons
    getChargeTime(params: AbilityParams): number
    getHealthCost(params: AbilityParams): number
    getStaminaCost(params: AbilityParams): number
    getManaCost(params: AbilityParams): number
    exec(params: AbilityParams): AbilityResult
}
