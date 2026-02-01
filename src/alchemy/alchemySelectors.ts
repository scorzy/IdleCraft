import { GameState } from '../game/GameState'
import { Item } from '../items/Item'
import { EffectPotency } from '../effects/types/EffectPotency'
import { Effects } from '../effects/types/Effects'
import { PotionEffect } from './alchemyTypes'
import { alchemyEffectData } from './alchemyData'

export const selectDiscoveredEffectsPosition = (_state: GameState) => 1

export const isEffectDiscovered = (state: GameState, item: Item, effect: Effects) => {
    if (!item.ingredientData) return false

    const discoveredPos = selectDiscoveredEffectsPosition(state)
    if (discoveredPos > 0) {
        const position = item.ingredientData.effects.findIndex((e) => e.effect === effect)
        if (position >= 0 && position < discoveredPos) return true
    }

    return state.discoveredEffects[item.id]?.includes(effect) ?? false
}
export function getPotionEffect(
    _state: GameState,
    effect: Effects,
    potencies: EffectPotency[]
): PotionEffect | undefined {
    if (potencies.length < 2) return

    const effectData = alchemyEffectData[effect]
    let value = 0
    let duration = 0

    if (effectData.instant) {
        value = potencies.reduce((sum, potency) => {
            switch (potency) {
                case EffectPotency.Low:
                    return sum + 10
                case EffectPotency.Medium:
                    return sum + 25
                case EffectPotency.High:
                    return sum + 50
            }
        }, 0)
    } else {
        value = potencies.reduce((sum, potency) => {
            switch (potency) {
                case EffectPotency.Low:
                    return sum + 1
                case EffectPotency.Medium:
                    return sum + 2
                case EffectPotency.High:
                    return sum + 3
            }
        }, 0)

        duration = potencies.reduce((sum, potency) => {
            switch (potency) {
                case EffectPotency.Low:
                    return sum + 5 * 1e3
                case EffectPotency.Medium:
                    return sum + 15 * 1e3
                case EffectPotency.High:
                    return sum + 30 * 1e3
            }
        }, 0)
    }

    return { effect, value, duration }
}
