import { EffectPotency } from '../effects/types/EffectPotency'
import { Effects } from '../effects/types/Effects'

export enum PotionResult {
    Stable = 'Stable',
    Unstable = 'Unstable',
    Chaotic = 'Chaotic',
    Unknown = 'Unknown',
    NotPotion = 'NotPotion',
}
export enum IngredientTypes {
    Herb = 'Herb',
    Mineral = 'Mineral',
    Animal = 'Animal',
}
export interface IngredientEffect {
    potency: EffectPotency
    effect: Effects
}

export interface IngredientData {
    type: IngredientTypes
    effects: IngredientEffect[]
    stability?: number
}
export interface SolventData {
    potency: EffectPotency
}
export interface PotionFlaskData {
    reusePercent: number
}

export interface PotionEffect {
    effect: Effects
    value: number
    duration: number
}

export interface PotionData {
    effects: PotionEffect[]
}
