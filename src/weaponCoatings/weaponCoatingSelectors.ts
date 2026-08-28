import { AppliedEffectAdapter } from '../effects/types/AppliedEffect'
import { GameState } from '../game/GameState'
import { TimerAdapter } from '../timers/Timer'
import { CharacterAdapter } from '../characters/characterAdapter'
import { getCharacterSelector } from '../characters/getCharacterSelector'
import { getActiveWeaponCoating } from './weaponCoatingFunctions'
import { isWeaponCoatingEffect } from './weaponCoatingTypes'

export const selectActiveWeaponCoating = (charId: string) => (state: GameState) => getActiveWeaponCoating(state, charId)

export const selectWeaponCoatingEffects = (charId: string) => (state: GameState) =>
    AppliedEffectAdapter.findMany(
        state.effects,
        (effect) =>
            isWeaponCoatingEffect(effect.effect) &&
            effect.target === charId &&
            effect.sourceId !== undefined &&
            effect.value !== undefined &&
            effect.value < 0
    )

export const selectWeaponCoatingEffectRemaining = (effectId: string) => (state: GameState) => {
    const timer = TimerAdapter.find(state.timers, (entry) => entry.actId === effectId)
    if (!timer) return 0
    return Math.max(timer.to - state.now, 0)
}

export const selectCharacterWeaponId = (charId: string) => (state: GameState) => {
    if (!CharacterAdapter.select(state.characters, charId)) return
    return getCharacterSelector(charId).MainWeapon(state)?.id
}
