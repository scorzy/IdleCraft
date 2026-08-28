import { ActivityTypes } from '../activities/ActivityState'
import { addHealth, addMana, addStamina } from '../characters/functions/charFunctions'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { Msg } from '../msg/Msg'
import { startTimer } from '../timers/startTimer'
import { Timer, TimerAdapter } from '../timers/Timer'
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
    sourceId?: string
}

export function applyInstantEffect(state: GameState, data: EffectData): void {
    if (!(data.target && data.value && data.value !== 0)) return

    switch (data.effect) {
        case Effects.Health:
            addHealth(state, data.target, data.value)
            break
        case Effects.Stamina:
            addStamina(state, data.target, data.value)
            break
        case Effects.Mana:
            addMana(state, data.target, data.value)
            break
        case Effects.DamageHealth:
            addHealth(state, data.target, -data.value)
            break
        case Effects.DamageStamina:
            addStamina(state, data.target, -data.value)
            break
        case Effects.DamageMana:
            addMana(state, data.target, -data.value)
            break
    }
}
export function applyEffect(state: GameState, data: EffectData): void {
    if (!data.duration || data.duration <= 0) {
        applyInstantEffect(state, data)
        return
    }

    const existing = data.sourceId
        ? AppliedEffectAdapter.find(
              state.effects,
              (effect) =>
                  effect.sourceId === data.sourceId && effect.effect === data.effect && effect.target === data.target
          )
        : undefined

    if (existing) {
        existing.duration = data.duration
        existing.nameId = data.nameId
        existing.iconId = data.iconId
        existing.value = data.value

        TimerAdapter.findMany(state.timers, (timer) => timer.actId === existing.id).forEach((timer) =>
            TimerAdapter.remove(state.timers, timer.id)
        )
        startTimer(state, data.duration, ActivityTypes.Effect, existing.id)
        return
    }

    const appliedEffect: AppliedEffect = {
        id: getUniqueId(),
        effect: data.effect,
        duration: data.duration,
        nameId: data.nameId,
        iconId: data.iconId,
        target: data.target,
        value: data.value,
        sourceId: data.sourceId,
    }

    startTimer(state, data.duration, ActivityTypes.Effect, appliedEffect.id)

    AppliedEffectAdapter.create(state.effects, appliedEffect)
}
export const onEffectEnd = (state: GameState, timer: Timer) => {
    const effect = AppliedEffectAdapter.select(state.effects, timer.actId)
    if (!effect) return
    AppliedEffectAdapter.remove(state.effects, effect.id)
}
