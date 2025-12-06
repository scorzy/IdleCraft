import { ActivityTypes } from '../activities/ActivityState'
import { addHealth, addMana, addStamina } from '../characters/functions/charFunctions'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { startTimer } from '../timers/startTimer'
import { Timer } from '../timers/Timer'
import { getUniqueId } from '../utils/getUniqueId'
import { AppliedEffect, AppliedEffectAdapter } from './types/AppliedEffect'
import { Effects } from './types/Effects'

export interface EffectData {
    effect: Effects
    nameId: keyof Msg
    iconId: Icons
    duration?: number
    target?: string
    value?: number
}

export function applyInstantEffect(state: GameState, data: EffectData): GameState {
    switch (data.effect) {
        case Effects.Health:
            if (data.target && data.value && data.value > 0) addHealth(state, data.target, data.value)
            break
        case Effects.Stamina:
            if (data.target && data.value && data.value > 0) addStamina(state, data.target, data.value)
            break
        case Effects.Mana:
            if (data.target && data.value && data.value > 0) addMana(state, data.target, data.value)
            break
        case Effects.DamageHealth:
            if (data.target && data.value && data.value < 0) addHealth(state, data.target, data.value)
            break
        case Effects.DamageStamina:
            if (data.target && data.value && data.value < 0) addStamina(state, data.target, data.value)
            break
        case Effects.DamageMana:
            if (data.target && data.value && data.value < 0) addMana(state, data.target, data.value)
            break
    }

    return state
}
export function applyEffect(state: GameState, data: EffectData) {
    if (!data.duration || data.duration <= 0) {
        applyInstantEffect(state, data)
        return state
    }

    const appliedEffect: AppliedEffect = {
        id: getUniqueId(),
        effect: data.effect,
        duration: data.duration,
        nameId: data.nameId,
        iconId: data.iconId,
        target: data.target,
        value: data.value,
    }

    startTimer(state, data.duration, ActivityTypes.Effect, appliedEffect.id)

    AppliedEffectAdapter.create(state.effects, appliedEffect)

    return state
}
export const onEffectEnd = (state: GameState, timer: Timer) => {
    const effect = AppliedEffectAdapter.select(state.effects, timer.actId)
    if (!effect) return
    AppliedEffectAdapter.remove(state.effects, effect.id)
}
