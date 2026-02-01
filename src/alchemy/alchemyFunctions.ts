import { BonusResult } from '../bonus/Bonus'
import { getTotal } from '../bonus/BonusFunctions'
import { GameState } from '../game/GameState'
import { Icons } from '../icons/Icons'
import { Item, ItemTypes } from '../items/Item'
import { EffectPotency } from '../effects/types/EffectPotency'
import { Effects } from '../effects/types/Effects'
import { selectGameItem } from '../storage/StorageSelectors'
import { applyEffect, EffectData } from '../effects/effectsFunctions'
import { setState } from '../game/setState'
import { removeItem } from '../storage/storageFunctions'
import {
    BASE_STABILITY,
    CHAOTIC_POTENCY_PERCENT,
    EFFECT_VALUE_BASE,
    MULTIPLE_EFFECTS_STABILITY,
    NEGATIVE_EFFECT_STABILITY_PENALTY,
    STABILITY_STABLE,
    STABILITY_UNSTABLE,
    UNSTABLE_POTENCY_PERCENT,
} from './alchemyConst'
import { oppositeEffects } from './alchemyData'
import { isEffectDiscovered, getPotionEffect } from './alchemySelectors'
import { PotionData, PotionResult } from './alchemyTypes'

function getPotionValue(potionData: PotionData): number {
    let total = 0
    for (const effect of potionData.effects) total += effect.value * EFFECT_VALUE_BASE
    return Math.floor(total * (1 + potionData.effects.length / 4))
}

export function generatePotion(
    state: GameState,
    includeUnknownEffects: boolean,
    ingredients: Item[]
):
    | {
          item: Item | undefined
          stability: number
          potionResult: PotionResult
          unknownEffects: boolean
          potionResultBonusList: BonusResult
      }
    | undefined {
    if (ingredients.length < 2) return

    const allEffects = new Map<Effects, { potency: EffectPotency }[]>()
    let unknownEffects = false

    for (const ingredient of ingredients)
        for (const effect of ingredient.ingredientData!.effects) {
            const isKnown = isEffectDiscovered(state, ingredient, effect.effect)
            unknownEffects ||= !isKnown
            if (!includeUnknownEffects && !isKnown) continue
            if (!allEffects.has(effect.effect)) allEffects.set(effect.effect, [])
            allEffects.get(effect.effect)!.push({ potency: effect.potency })
        }

    allEffects.forEach((potencies, effect) => {
        if (potencies.length < 2) allEffects.delete(effect)
    })

    const potionData: PotionData = { effects: [] }

    for (const [effect, potencies] of allEffects.entries()) {
        const effects = getPotionEffect(
            state,
            effect,
            potencies.map((p) => p.potency)
        )
        if (effects) potionData!.effects.push(effects)
    }

    potionData.effects.sort((a, b) => b.value - a.value)

    const potionResultBonusList: BonusResult = { total: 0, bonuses: [] }
    potionResultBonusList.bonuses.push({
        id: `Base`,
        nameId: 'Base',
        iconId: Icons.OppositeIngredient,
        add: BASE_STABILITY,
    })

    const effects = potionData.effects
    let stability = BASE_STABILITY
    let potionResult: PotionResult = PotionResult.Chaotic

    if (effects.length === 0) {
        if (unknownEffects) potionResult = PotionResult.Unknown
        else potionResult = PotionResult.NotPotion
    } else {
        setStability(potionData, potionResultBonusList, ingredients)

        potionResultBonusList.total = getTotal(potionResultBonusList.bonuses)
        stability = potionResultBonusList.total

        if (stability > STABILITY_STABLE) potionResult = PotionResult.Stable
        else if (stability > STABILITY_UNSTABLE) potionResult = PotionResult.Unstable
        else if (stability > 0) potionResult = PotionResult.Chaotic
        else potionResult = PotionResult.NotPotion

        alterEffects(potionData, potionResult)
    }

    let item: Item | undefined = undefined
    if (PotionResult.NotPotion !== potionResult)
        item = {
            id: '',
            nameId: 'Potion',
            icon: Icons.Potion,
            type: ItemTypes.Potion,
            value: getPotionValue(potionData),
            potionData,
        }

    return {
        item,
        stability,
        potionResult,
        unknownEffects,
        potionResultBonusList,
    }
}

function setStability(potionData: PotionData, potionResultBonusList: BonusResult, ingredients: Item[]) {
    const effects = potionData.effects

    for (const effect of effects) {
        const negatives =
            oppositeEffects.find((pair) => pair.first.includes(effect.effect))?.second ||
            oppositeEffects.find((pair) => pair.second.includes(effect.effect))?.first

        if (!negatives) continue

        for (const negative of negatives) {
            const negativeEffect = effects.find((e) => e.effect === negative)
            if (negativeEffect) {
                potionResultBonusList.bonuses.push({
                    id: `Opp_${effect.effect}_${negative}`,
                    nameId: 'OppositeEffects',
                    iconId: Icons.OppositeIngredient,
                    add: (effect.value + negativeEffect.value) * NEGATIVE_EFFECT_STABILITY_PENALTY,
                })
            }
        }
    }

    if (potionData.effects.length >= 2) {
        potionResultBonusList.bonuses.push({
            id: `MultiEffects`,
            nameId: 'MultipleEffects',
            iconId: Icons.MultipleEffects,
            add: MULTIPLE_EFFECTS_STABILITY * (potionData.effects.length - 1),
        })
    }

    const stabilityFromIngredients = ingredients.reduce(
        (sum, ingredient) => sum + (ingredient.ingredientData?.stability || 0),
        0
    )

    if (Math.abs(stabilityFromIngredients) > 0.1)
        potionResultBonusList.bonuses.push({
            id: `IngredientsStability`,
            nameId: 'IngredientsStability',
            iconId: stabilityFromIngredients > 0 ? Icons.ArrowUp : Icons.ArrowDown,
            add: stabilityFromIngredients,
        })
}

function alterEffects(potionData: PotionData, potionResult: PotionResult) {
    if (potionResult === PotionResult.Unstable) {
        // Unstable: reduce all effects
        for (const effect of potionData.effects) effect.value = Math.floor(effect.value * UNSTABLE_POTENCY_PERCENT)
    } else if (potionResult === PotionResult.Chaotic) {
        // Chaotic: reduce all effects and remove last effect
        for (const effect of potionData.effects) effect.value = Math.floor(effect.value * CHAOTIC_POTENCY_PERCENT)
        if (potionData.effects.length <= 1) return
        const toRemove = potionData.effects.length - 1
        potionData.effects.splice(toRemove, 1)
    }
}

export function consumePotion(state: GameState, charId: string, itemId: string): void {
    const item = selectGameItem(itemId)(state)
    if (!item || !item.potionData) return

    for (const effect of item.potionData.effects) {
        const effectData: EffectData = {
            effect: effect.effect,
            nameId: item.nameId,
            iconId: item.icon,
            duration: effect.duration,
            target: charId,
            value: effect.value,
        }
        applyEffect(state, effectData)
    }

    removeItem(state, itemId, 1)
}
export const consumePotionClick = (charId: string, itemId: string) => setState((s) => consumePotion(s, charId, itemId))
