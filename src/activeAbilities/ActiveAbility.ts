import { ReactNode } from 'react'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { AbilitiesEnum } from './abilitiesEnum'

export interface AbilityParams {
    state: GameState
    characterId: string
}

export interface AbilityStartResult {
    state: GameState
    started: boolean
}
export interface ActiveAbility {
    id: AbilitiesEnum
    nameId: keyof Msg
    getDesc(params: AbilityParams): ReactNode
    getIconId(params: AbilityParams): Icons
    getChargeTime(params: AbilityParams): number
    getHealthCost(params: AbilityParams): number
    getStaminaCost(params: AbilityParams): number
    getManaCost(params: AbilityParams): number

    exec(params: AbilityParams): GameState
}
