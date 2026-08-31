import { AppliedEffectAdapter } from '../effects/types/AppliedEffect'
import { AppliedEffect } from '../effects/types/AppliedEffect'
import { GameState } from '../game/GameState'
import { Timer, TimerAdapter } from '../timers/Timer'
import { CharacterAdapter } from '../characters/characterAdapter'
import { getCharacterSelector } from '../characters/getCharacterSelector'
import { getActiveWeaponCoating } from './weaponCoatingFunctions'
import { isWeaponCoatingEffect } from './weaponCoatingTypes'

export const selectActiveWeaponCoating = (charId: string) => (state: GameState) => getActiveWeaponCoating(state, charId)

const EFFECT_TIMER_GROUP_TOLERANCE_MS = 100

export interface WeaponCoatingEffectGroup {
    effect: AppliedEffect
    timer: Timer
    totalValue: number
    count: number
}

export function groupWeaponCoatingEffects(
    effects: { effect: AppliedEffect; timer: Timer }[]
): WeaponCoatingEffectGroup[] {
    const groups: WeaponCoatingEffectGroup[] = []

    for (const entry of effects) {
        const group = groups.find(
            (candidate) =>
                candidate.effect.effect === entry.effect.effect &&
                Math.abs(candidate.timer.from - entry.timer.from) < EFFECT_TIMER_GROUP_TOLERANCE_MS &&
                Math.abs(candidate.timer.to - entry.timer.to) < EFFECT_TIMER_GROUP_TOLERANCE_MS
        )

        if (group) {
            group.totalValue += Math.abs(entry.effect.value ?? 0)
            group.count++
            continue
        }

        groups.push({
            effect: entry.effect,
            timer: entry.timer,
            totalValue: Math.abs(entry.effect.value ?? 0),
            count: 1,
        })
    }

    return groups
}

export const selectWeaponCoatingEffects = (charId: string) => (state: GameState) => {
    const effects = AppliedEffectAdapter.findMany(
        state.effects,
        (effect) =>
            isWeaponCoatingEffect(effect.effect) &&
            effect.target === charId &&
            effect.sourceId !== undefined &&
            effect.value !== undefined &&
            effect.value < 0
    )

    return groupWeaponCoatingEffects(
        effects.flatMap((effect) => {
            const timer = TimerAdapter.find(state.timers, (entry) => entry.actId === effect.id)
            return timer ? [{ effect, timer }] : []
        })
    )
}

export const selectWeaponCoatingEffectRemaining = (effectId: string) => (state: GameState) => {
    const timer = TimerAdapter.find(state.timers, (entry) => entry.actId === effectId)
    if (!timer) return 0
    return Math.max(timer.to - state.now, 0)
}

export const selectCharacterWeaponId = (charId: string) => (state: GameState) => {
    if (!CharacterAdapter.select(state.characters, charId)) return
    return getCharacterSelector(charId).MainWeapon(state)?.id
}
