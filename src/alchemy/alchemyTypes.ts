import { RecipeResult } from '../crafting/RecipeInterfaces'

export enum AlchemyPotency {
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
}
export enum AlchemyEffects {
    Health = 'Health',
    Mana = 'Mana',
    Stamina = 'Stamina',
    RegenHealth = 'RegenHealth',
    RegenMana = 'RegenMana',
    RegenStamina = 'RegenStamina',
    DamageHealth = 'DamageHealth',
    DamageMana = 'DamageMana',
    DamageStamina = 'DamageStamina',
    DamageRegenHealth = 'DamageRegenHealth',
    DamageRegenMana = 'vRegenMana',
    DamageRegenStamina = 'DamageRegenStamina',
}
export enum IngredientTypes {
    Herb = 'Herb',
    Mineral = 'Mineral',
    Animal = 'Animal',
}
export interface IngredientEffect {
    efficiency: AlchemyPotency
    effect: AlchemyEffects
}

export interface IngredientData {
    type: IngredientTypes
    effects: IngredientEffect[]
}
export interface SolventData {
    efficiency: AlchemyPotency
}
export interface PotionFlaskData {
    reusePercent: number
}
export interface PotionCraftingResult extends RecipeResult {
    stability: number
}
