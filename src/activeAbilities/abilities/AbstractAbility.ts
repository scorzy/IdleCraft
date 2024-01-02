import { ReactNode } from 'react'
import { Icons } from '../../icons/Icons'
import { Msg } from '../../msg/Msg'
import { AbilityParams, AbilityResult, AbilityStartResult, ActiveAbility } from '../ActiveAbility'
import { CharacterStateAdapter } from '../../characters/characterAdapter'
import { startTimer } from '../../timers/startTimer'
import { TimerTypes } from '../../timers/Timer'

export abstract class AbstractAbility implements ActiveAbility {
    abstract id: string
    abstract nameId: keyof Msg
    abstract getDesc(params: AbilityParams): ReactNode
    abstract getIconId(params: AbilityParams): Icons
    abstract getChargeTime(params: AbilityParams): number
    abstract getHealthCost(params: AbilityParams): number
    abstract getStaminaCost(params: AbilityParams): number
    abstract getManaCost(params: AbilityParams): number
    canStart(params: AbilityParams): boolean {
        const { state, characterId } = params

        const character = CharacterStateAdapter.selectEx(state.characters, characterId)

        const hCost = this.getHealthCost({ state, characterId })
        if (hCost > character.health + 1) return false

        if (this.getStaminaCost({ state, characterId }) > character.stamina) return false
        if (this.getManaCost({ state, characterId }) > character.mana) return false

        return true
    }
    start(params: AbilityParams): AbilityStartResult {
        if (!this.canStart(params)) return { state: params.state, started: false }

        let { state } = params
        const { characterId } = params

        const hCost = this.getHealthCost({ state, characterId })
        const sCost = this.getStaminaCost({ state, characterId })
        const mCost = this.getManaCost({ state, characterId })

        const char = CharacterStateAdapter.selectEx(state.characters, characterId)
        const charUp = {
            health: Math.max(0, char.health - hCost),
            stamina: Math.max(char.stamina - sCost),
            mana: Math.max(char.mana - mCost),
        }

        state = {
            ...state,
            characters: CharacterStateAdapter.update(state.characters, characterId, charUp),
        }

        const time = this.getChargeTime({ ...params, state })
        state = startTimer(state, time, TimerTypes.Activity)

        return {
            started: true,
            state: {
                ...state,
                characters: CharacterStateAdapter.update(state.characters, characterId, charUp),
            },
        }
    }
    exec(params: AbilityParams): AbilityResult {
        throw new Error('Method not implemented.')
    }
}
