import { GameState } from '../game/GameState'
import { Item } from '../items/Item'
import { AlchemyEffects, AlchemyPotency, PotionEffect } from './alchemyTypes'

export const selectDiscoveredEffectsPosition = (_state: GameState) => 1

export const isEffectDiscovered = (state: GameState, item: Item, effect: AlchemyEffects) => {
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
    effect: AlchemyEffects,
    potencies: AlchemyPotency[]
): PotionEffect | undefined {
    if (potencies.length < 2) return

    const value = potencies.reduce((sum, potency) => {
        switch (potency) {
            case AlchemyPotency.Low:
                return sum + 10
            case AlchemyPotency.Medium:
                return sum + 25
            case AlchemyPotency.High:
                return sum + 50
        }
    }, 0)

    const duration = potencies.reduce((sum, potency) => {
        switch (potency) {
            case AlchemyPotency.Low:
                return sum + 5 * 1e3
            case AlchemyPotency.Medium:
                return sum + 15 * 1e3
            case AlchemyPotency.High:
                return sum + 30 * 1e3
        }
    }, 0)

    return { effect, value, duration }
}
